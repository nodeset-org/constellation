
const { Defender } = require('@openzeppelin/defender-sdk');
const { ethers } = require('ethers');
const axios = require('axios');

const GITHUB_REPO_API = 'https://api.github.com/repos/rocket-pool/rewards-trees/contents/holesky';
const GITHUB_TOKEN = 'your_github_token';


const NODE_ADDRESS = ''

const ROCKET_STORAGE_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldGuardian","type":"address"},{"indexed":false,"internalType":"address","name":"newGuardian","type":"address"}],"name":"GuardianChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"node","type":"address"},{"indexed":true,"internalType":"address","name":"withdrawalAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"NodeWithdrawalAddressSet","type":"event"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"addUint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"confirmGuardian","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_nodeAddress","type":"address"}],"name":"confirmWithdrawalAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"deleteAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"deleteBool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"deleteBytes","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"deleteBytes32","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"deleteInt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"deleteString","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"deleteUint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"getAddress","outputs":[{"internalType":"address","name":"r","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"getBool","outputs":[{"internalType":"bool","name":"r","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"getBytes","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"getBytes32","outputs":[{"internalType":"bytes32","name":"r","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDeployedStatus","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getGuardian","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"getInt","outputs":[{"internalType":"int256","name":"r","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_nodeAddress","type":"address"}],"name":"getNodePendingWithdrawalAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_nodeAddress","type":"address"}],"name":"getNodeWithdrawalAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"getString","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"getUint","outputs":[{"internalType":"uint256","name":"r","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"},{"internalType":"address","name":"_value","type":"address"}],"name":"setAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"},{"internalType":"bool","name":"_value","type":"bool"}],"name":"setBool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"},{"internalType":"bytes","name":"_value","type":"bytes"}],"name":"setBytes","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"},{"internalType":"bytes32","name":"_value","type":"bytes32"}],"name":"setBytes32","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"setDeployedStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newAddress","type":"address"}],"name":"setGuardian","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"},{"internalType":"int256","name":"_value","type":"int256"}],"name":"setInt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"},{"internalType":"string","name":"_value","type":"string"}],"name":"setString","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"},{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"setUint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_nodeAddress","type":"address"},{"internalType":"address","name":"_newWithdrawalAddress","type":"address"},{"internalType":"bool","name":"_confirm","type":"bool"}],"name":"setWithdrawalAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"subUint","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const ROCKET_STORAGE_ADDRESS = "0x594Fb75D3dc2DFa0150Ad03F99F97817747dd4E1"

const MERKLE_CLAIM_STREAMER_ABI = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newEthRewards","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newRplRewards","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ethTreasuryPortion","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ethOperatorPortion","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"rplTreasuryPortion","type":"uint256"}],"name":"MerkleClaimSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"inputs":[],"name":"getDirectory","outputs":[{"internalType":"contract Directory","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getImplementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStreamedTvlEth","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStreamedTvlRpl","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_directory","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lastClaimTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"merkleClaimsEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"priorEthStreamAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"priorRplStreamAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxiableUUID","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"_isEnabled","type":"bool"}],"name":"setMerkleClaimsEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newStreamingInterval","type":"uint256"}],"name":"setStreamingInterval","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"streamingInterval","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"rewardIndex","type":"uint256[]"},{"internalType":"uint256[]","name":"amountRPL","type":"uint256[]"},{"internalType":"uint256[]","name":"amountETH","type":"uint256[]"},{"internalType":"bytes32[][]","name":"merkleProof","type":"bytes32[][]"}],"name":"submitMerkleClaim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"sweepLockedTVL","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]
const MERKLE_CLAIM_STREAMER_ADDRESS = "0x519819178206E0a8B7b089FbAE23FFd4f06FA2C3"

function isClaimed(claimedWord, bitIndex) {
    // Using BigNumber to manipulate bits
    const mask = ethers.BigNumber.from(1).shl(bitIndex); // 1 << bitIndex
    return !claimedWord.and(mask).eq(0); // Check if the bit is set
}

async function fetchRewardFiles() {
    const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};

    try {
        const response = await axios.get(GITHUB_REPO_API, { headers });
        const files = response.data;
        // Filter and only keep files that are numbers (reward interval files)
        const rewardFiles = files.filter(file => /^[0-9]+$/.test(file.name));
        return rewardFiles;
    } catch (error) {
        console.error('Error fetching files from GitHub:', error);
        throw error;
    }
}


async function fetchRewardFileContent(url) {
    const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};

    try {
        const response = await axios.get(url, { headers });
        const content = Buffer.from(response.data.content, 'base64').toString(); // Decode the base64-encoded content
        return JSON.parse(content); // Assuming the file is JSON format
    } catch (error) {
        console.error('Error fetching file content from GitHub:', error);
        throw error;
    }
}

exports.handler = async function(credentials) {
    const client = new Defender(credentials);

    const provider = client.relaySigner.getProvider();
    const signer = await client.relaySigner.getSigner(provider, { speed: 'fast' });

    const rocketStorage = new ethers.Contract(ROCKET_STORAGE_ADDRESS, ROCKET_STORAGE_ABI, provider)
    const merkleClaimStreamer = new ethers.Contract(MERKLE_CLAIM_STREAMER_ADDRESS, MERKLE_CLAIM_STREAMER_ABI, provider)

    try {
        // Fetch reward files from GitHub
        const rewardFiles = await fetchRewardFiles();
        console.log('Fetched reward files:', rewardFiles.map(file => file.name));

        // Loop over each reward file
        for (const file of rewardFiles) {
            // Extract interval from filenames like 'rp-rewards-holesky-124.json' or 'rp-rewards-holesky-999.json'
            const intervalMatch = file.name.match(/rp-rewards-holesky-(\d+)\.json/);
            if (!intervalMatch) {
                console.log(`Invalid filename format: ${file.name}, skipping...`);
                continue; // Skip if the filename doesn't match the expected pattern
            }

            const interval = parseInt(intervalMatch[1], 10); // Extracted interval number
            const indexWordIndex = Math.floor(interval / 256); // Get the word index
            const indexBitIndex = interval % 256; // Get the bit index within that word

            // Create the key for checking whether the reward has been claimed
            const claimedWordKey = ethers.utils.keccak256(
                ethers.utils.defaultAbiCoder.encode(
                    ['string', 'address', 'uint256'],
                    ['rewards.interval.claimed', NODE_ADDRESS, indexWordIndex]
                )
            );

            // Get the claimedWord for this interval
            const claimedWord = await rocketStorage.getUint(claimedWordKey);

            // Check if the reward has been claimed
            if (isClaimed(claimedWord, indexBitIndex)) {
                console.log(`Reward interval ${interval} has already been claimed, skipping...`);
                continue; // Skip to the next interval
            }

            // Reward hasn't been claimed, fetch the file content
            console.log(`Fetching content for interval ${interval}...`);
            const rewardData = await fetchRewardFileContent(file.download_url);

            // Find the node's reward data in the file
            const nodeRewards = rewardData.nodeRewards[NODE_ADDRESS];
            if (!nodeRewards) {
                console.log(`No rewards found for node ${NODE_ADDRESS} in interval ${interval}, skipping...`);
                continue; // Skip if no rewards are found for the node
            }

            // Extract the parameters needed for the claim from the file
            const { merkleProof, collateralRpl, oracleDaoRpl, smoothingPoolEth } = nodeRewards;

            try {
                // Submit Merkle Claim
                console.log(`Claiming reward for interval ${interval} with proof:`, merkleProof);

                const rewardIndex = [interval];
                const amountRPL = [collateralRpl];
                const amountETH = [smoothingPoolEth];
                const merkleProofs = [merkleProof];

                const txResult = await merkleClaimStreamer.submitMerkleClaim(
                    rewardIndex, amountRPL, amountETH, merkleProofs
                );

                console.log(`Successfully claimed reward for interval ${interval}, tx: ${txResult.hash}`);
            } catch (error) {
                console.error(`Failed to claim reward for interval ${interval}:`, error);
            }
        }
    } catch (error) {
        console.error('Error processing rewards:', error);
    }


}

