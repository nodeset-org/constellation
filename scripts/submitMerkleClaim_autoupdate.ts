
// comment this out for deployment
require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');
const { ethers } = require('ethers');
const axios = require('axios');

// comment this out for deployment (Defender will provide the credentials)
// if you're testing, you need these relayer API keys set in your .env file
const credentials = {
  relayerApiKey: `${process.env.DEFENDER_RELAY_KEY}`,
  relayerApiSecret: `${process.env.DEFENDER_RELAY_SECRET}`,
};

const GITHUB_REPO_API = `https://api.github.com/repos/rocket-pool/rewards-trees/contents/${process.env.NETWORK}`;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const SUPERNODE_ADDRESS = process.env.SUPERNODE_ADDRESS

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
        const rewardFiles = files.filter(file => new RegExp(`rp-rewards-${process.env.NETWORK}-\\d+\\.json`).test(file.name));
        return rewardFiles;
    } catch (error) {
        console.log('Error fetching files from GitHub:', error);
        throw error;
    }
}


async function fetchRewardFileContent(downloadUrl) {
    try {
        const response = await axios.get(downloadUrl);
        return response.data; // Assuming the content is JSON, you can directly return the parsed JSON
    } catch (error) {
        console.log('Error fetching file content from GitHub:', error);
        throw error;
    }
}

function processRewardsForVersion(rewardData, version, nodeAddress) {
    // TODO: Handle different versions later
    switch (version) {
        case 1:
            return processVersion1(rewardData, nodeAddress);
        case 2:
            return processVersion1(rewardData, nodeAddress);
        case 3:
            return processVersion1(rewardData, nodeAddress);
        default:
            return processVersion1(rewardData, nodeAddress);
    }
}

function processVersion1(rewardData, nodeAddress) {
    const nodeRewards = rewardData.nodeRewards[nodeAddress];
    if (!nodeRewards) {
        return null;
    }

    const { merkleProof, collateralRpl, oracleDaoRpl, smoothingPoolEth } = nodeRewards;
    return { merkleProof, collateralRpl, oracleDaoRpl, smoothingPoolEth };
}

//comment this out for deployment
testFunction(credentials);

// use the exports.handler line for deployment, use the other one for testing
// exports.handler = async function(credentials) {
async function testFunction(credentials: any) {
    const client = new Defender(credentials);

    const provider = client.relaySigner.getProvider();
    const signer = await client.relaySigner.getSigner(provider, { speed: 'fast' });

    const rocketStorage = new ethers.Contract(ROCKET_STORAGE_ADDRESS, ROCKET_STORAGE_ABI, provider);
    const merkleClaimStreamer = new ethers.Contract(MERKLE_CLAIM_STREAMER_ADDRESS, MERKLE_CLAIM_STREAMER_ABI, provider);

    // Arrays to accumulate all claims
    let rewardIndexes = [];
    let amountsRPL = [];
    let amountsETH = [];
    let merkleProofsArray = [];

    try {
        // Fetch reward files from GitHub
        const rewardFiles = await fetchRewardFiles();
        console.log('Fetched reward files:', rewardFiles.length);

        // Loop over each reward file and collect data for all claims
        for (const file of rewardFiles) {
            console.log("\n")
            // Extract interval from filenames like 'rp-rewards-holesky-124.json' or 'rp-rewards-holesky-999.json'
            const intervalMatch = file.name.match(new RegExp(`rp-rewards-${process.env.NETWORK}-(\\d+)\\.json`));
            if (!intervalMatch) {
                console.log(`Invalid filename format: ${file.name}, skipping...`);
                continue; // Skip if the filename doesn't match the expected pattern
            }

            const interval = parseInt(intervalMatch[1], 10); // Extracted interval number
            const indexWordIndex = Math.floor(interval / 256); // Get the word index
            const indexBitIndex = interval % 256; // Get the bit index within that word

            // Skip file if merkle root has not been posted yet
            const encodedData = ethers.utils.concat([
                ethers.utils.toUtf8Bytes('rewards.merkle.root'),  // String to bytes
                ethers.utils.zeroPad(ethers.utils.hexlify(interval), 32)  // Zero-pad the reward index to 32 bytes (uint256)
            ]);
            const key = ethers.utils.keccak256(encodedData);
            const merkleRoot = await rocketStorage.getBytes32(key);
            if (merkleRoot === '0x0000000000000000000000000000000000000000000000000000000000000000') {
                console.log(`Merkle root not set for interval ${interval}, skipping...`);
                continue; // Skip to the next interval
            }

            // Create the key for checking whether the reward has been claimed
            const claimedWordKey = ethers.utils.keccak256(
                ethers.utils.defaultAbiCoder.encode(
                    ['string', 'address', 'uint256'],
                    ['rewards.interval.claimed', SUPERNODE_ADDRESS.toLowerCase(), indexWordIndex]
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

            const { rewardsFileVersion } = rewardData;

            // Process rewards based on the version of the file
            let rewardsInfo;
            try {
                rewardsInfo = processRewardsForVersion(rewardData, rewardsFileVersion, SUPERNODE_ADDRESS.toLowerCase());
            } catch (error) {
                console.log(`Error processing rewards for interval ${interval}:`, error);
                continue;
            }

            if (rewardsInfo === null) {
                console.log(`No rewards found for interval ${interval}, skipping...`);
                continue; // Skip to the next interval
            }

            const { merkleProof, collateralRpl, oracleDaoRpl, smoothingPoolEth } = rewardsInfo;
            const totalRplReward = ethers.BigNumber.from(collateralRpl).add(oracleDaoRpl);

            console.log("Adding reward from interval", interval);

            // Accumulate claims data for batch submission
            rewardIndexes.push(interval);
            amountsRPL.push(totalRplReward.toString());
            amountsETH.push(smoothingPoolEth);
            merkleProofsArray.push(merkleProof);
        }

        // Submit all claims in a single transaction
        if (rewardIndexes.length > 0) {
            try {
                console.log(`Submitting batch Merkle claim for ${rewardIndexes.length} intervals...`);

                // use the callStatic line for local testing, the other for deployment
                const txResult = await merkleClaimStreamer.callStatic.submitMerkleClaim(
                    rewardIndexes,
                    amountsRPL,
                    amountsETH,
                    merkleProofsArray,
                    { maxFeePerGas: 200, gasLimit: 1000000 }
                );
                // const txResult = await merkleClaimStreamer.submitMerkleClaim(
                //     rewardIndexes,
                //     amountsRPL,
                //     amountsETH,
                //     merkleProofsArray,
                //     { maxFeePerGas: 200, gasLimit: 1000000 }
                // );

                // uncomment this for deployment
                // return txResult.hash;
            } catch (error) {
                console.log(`Failed to submit Merkle claim:`, error);
            }
        } else {
            console.log('No unclaimed rewards to submit.');
        }
    } catch (error) {
        console.log('Error processing rewards:', error);
    }

};