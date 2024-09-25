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



// Set claim data
const claims: Claim[] = [
  {
    nodeAddress: '0x095BF624170fE87e6D3a64590b4C6CaF912CCE01',
    amountRPL: '15661092201810502126',
    amountETH: '38003651283735',
  },
  {
    nodeAddress: '0x095BF624170fE87e6D3a64590b4C6CaF912CCE01',
    amountRPL: '7737634255681177023',
    amountETH: '22150523603742',
  },
];

// ************************************************************************************************************
// ************************************************************************************************************
// ************************************************************************************************************
// ************************************************************************************************************

const network = ethers.BigNumber.from('0');

// Create leaves by hashing each claim (nodeAddress, network, amountRPL, amountETH)
const leaves: Buffer[] = claims.map((claim) => {
  const packedData = ethers.utils.solidityPack(
    ['address', 'uint256', 'uint256', 'uint256'],
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
const leaf: Buffer = leaves[0];
console.log("!!! leaf", leaf, merkleTree.getProof(leaf));
const proof: string[] = merkleTree.getProof(leaf).map((x) => x.data.toString('hex'));

console.log("Merkle Proof:", proof);
