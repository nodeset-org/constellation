import { MerkleTree } from 'merkletreejs';
import { ethers } from 'ethers';

interface Claim {
  nodeAddress: string;
  amountRPL: string;
  amountETH: string;
}

// WARNING: Must fill out the following values before running the script
// ************************************************************************************************************
// ************************************************************************************************************
// ************************************************************************************************************

// Set network variable
const network: string = "some_network_value";

// Set claim data
const claims: Claim[] = [
  { nodeAddress: '0x123...', amountRPL: '500000000000000000', amountETH: '1000000000000000000' },
  { nodeAddress: '0x456...', amountRPL: '200000000000000000', amountETH: '3000000000000000000' },
];

const claimIndex: number = 0;

// ************************************************************************************************************
// ************************************************************************************************************
// ************************************************************************************************************
// ************************************************************************************************************



// Create leaves by hashing each claim (nodeAddress, network, amountRPL, amountETH)
const leaves: Buffer[] = claims.map((claim) => {
  const packedData = ethers.utils.solidityPack(
    ['address', 'string', 'uint256', 'uint256'],
    [claim.nodeAddress, network, claim.amountRPL, claim.amountETH]
  );
  const hashedData = ethers.utils.keccak256(packedData);
  return Buffer.from(hashedData.slice(2), 'hex');
});

// Create the Merkle tree
const merkleTree = new MerkleTree(leaves, (data: Buffer) => Buffer.from(ethers.utils.keccak256(data).slice(2), 'hex'), { sortPairs: true });

// Get the Merkle root
const merkleRoot: string = merkleTree.getRoot().toString('hex');
console.log("Merkle Root:", merkleRoot);

// Generate the Merkle proof for a specific claim (e.g., the first one)
const leaf: Buffer = leaves[claimIndex];
const proof: string[] = merkleTree.getProof(leaf).map((x) => x.data.toString('hex'));

console.log("Merkle Proof:", proof);
