// comment this out for deployment
// require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');
const { ethers } = require('ethers');

// comment this out for deployment (Defender will provide the credentials)
// if you're testing, you need these relayer API keys set in your .env file
// const credentials = {
//   relayerApiKey: `${process.env.DEFENDER_RELAY_KEY}`,
//   relayerApiSecret: `${process.env.DEFENDER_RELAY_SECRET}`,
// };

// Fill in network (i.e. holesky/mainnet) prior to running
const NETWORK = process.env.NETWORK || "holesky";

// Fill in github token prior to running
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Fill in directory contract address prior to running
const DIRECTORY_ADDRESS = process.env.DIRECTORY_ADDRESS;

// Fill in the number of files to process prior to running
const NUM_FILES_PROCESS = process.env.NUM_FILES_PROCESS || 50; // Default to 50 files if not set in environment


const GITHUB_REPO_API = `https://api.github.com/repos/rocket-pool/rewards-trees/contents/${NETWORK}`;


const ROCKET_STORAGE_ABI = [{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"addUint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"getAddress","outputs":[{"internalType":"address","name":"r","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"getBool","outputs":[{"internalType":"bool","name":"r","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"getBytes","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"getBytes32","outputs":[{"internalType":"bytes32","name":"r","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDeployedStatus","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getGuardian","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"getInt","outputs":[{"internalType":"int256","name":"r","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_nodeAddress","type":"address"}],"name":"getNodePendingWithdrawalAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_nodeAddress","type":"address"}],"name":"getNodeWithdrawalAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"getString","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"getUint","outputs":[{"internalType":"uint256","name":"r","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"subUint","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const MERKLE_CLAIM_STREAMER_ABI = [{"inputs":[],"name":"getDirectory","outputs":[{"internalType":"contract Directory","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"rewardIndex","type":"uint256[]"},{"internalType":"uint256[]","name":"amountRPL","type":"uint256[]"},{"internalType":"uint256[]","name":"amountETH","type":"uint256[]"},{"internalType":"bytes32[][]","name":"merkleProof","type":"bytes32[][]"}],"name":"submitMerkleClaim","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const DIRECTORY_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"getMerkleClaimStreamerAddress","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOperatorDistributorAddress","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOperatorRewardAddress","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOracleAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPriceFetcherAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getProtocol","outputs":[{"components":[{"internalType":"address","name":"whitelist","type":"address"},{"internalType":"address payable","name":"wethVault","type":"address"},{"internalType":"address","name":"rplVault","type":"address"},{"internalType":"address payable","name":"operatorDistributor","type":"address"},{"internalType":"address payable","name":"merkleClaimStreamer","type":"address"},{"internalType":"address","name":"oracle","type":"address"},{"internalType":"address","name":"priceFetcher","type":"address"},{"internalType":"address payable","name":"superNode","type":"address"},{"internalType":"address","name":"rocketStorage","type":"address"},{"internalType":"address payable","name":"weth","type":"address"},{"internalType":"address","name":"sanctions","type":"address"}],"internalType":"struct Protocol","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRPLAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRPLVaultAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRocketDAOProtocolProposalAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRocketDAOProtocolSettingsMinipool","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRocketDAOProtocolSettingsRewardsAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRocketDepositPoolAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRocketIntegrations","outputs":[{"components":[{"internalType":"address","name":"rocketNetworkPenalties","type":"address"},{"internalType":"address","name":"rocketNetworkPrices","type":"address"},{"internalType":"address","name":"rocketNodeDeposit","type":"address"},{"internalType":"address","name":"rocketNodeManager","type":"address"},{"internalType":"address","name":"rocketNodeStaking","type":"address"},{"internalType":"address","name":"rocketMinipoolManager","type":"address"},{"internalType":"address","name":"rplToken","type":"address"},{"internalType":"address","name":"rocketDepositPool","type":"address"},{"internalType":"address","name":"rocketMerkleDistributorMainnet","type":"address"},{"internalType":"address","name":"rocketNetworkVoting","type":"address"},{"internalType":"address","name":"rocketDAOProtocolProposal","type":"address"},{"internalType":"address","name":"rocketDAOProtocolSettingsRewards","type":"address"},{"internalType":"address","name":"rocketDAOProtocolSettingsMinipool","type":"address"}],"internalType":"struct RocketIntegrations","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRocketMerkleDistributorMainnetAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRocketMinipoolManagerAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRocketNetworkPenalties","outputs":[{"internalType":"contract IRocketNetworkPenalties","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRocketNetworkPrices","outputs":[{"internalType":"contract IRocketNetworkPrices","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRocketNetworkVotingAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRocketNodeDepositAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRocketNodeManagerAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRocketNodeStakingAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_tag","type":"string"}],"name":"getRocketPoolAddressByTag","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRocketStorageAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSanctionsAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSanctionsEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSuperNodeAddress","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTreasuryAddress","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getWETHAddress","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getWETHVaultAddress","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getWhitelistAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]


function isClaimed(claimedWord, bitIndex) {
    // Using BigNumber to manipulate bits
    const mask = ethers.BigNumber.from(1).shl(bitIndex); // 1 << bitIndex
    return !claimedWord.and(mask).eq(0); // Check if the bit is set
}

async function fetchRewardFiles() {
    const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};

    try {
        const response = await fetch(GITHUB_REPO_API, { headers });
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.statusText}`);
        }
        const files = await response.json();
        // Filter and only keep files that are numbers (reward interval files)
        const rewardFiles = files.filter(file => new RegExp(`rp-rewards-${NETWORK}-\\d+\\.json`).test(file.name));
        return rewardFiles;
    } catch (error) {
        console.log('Error fetching files from GitHub:', error);
        throw error;
    }
}

async function fetchRewardFileContent(downloadUrl) {
    try {
        const response = await fetch(downloadUrl);
        if (!response.ok) {
            throw new Error(`GitHub file fetch error: ${response.statusText}`);
        }
        return await response.json(); // Assuming the content is JSON
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
// testFunction(credentials);

// use the exports.handler line for deployment, use the other one for testing
exports.handler = async function(credentials) {
// async function testFunction(credentials: any) {
    const client = new Defender(credentials);

    const provider = client.relaySigner.getProvider();
    const signer = await client.relaySigner.getSigner(provider, { speed: 'fast' });

    const directory = new ethers.Contract(DIRECTORY_ADDRESS, DIRECTORY_ABI, provider);

    const rocketStorageAddress = await directory.getRocketStorageAddress();
    const merkleClaimStreamerAddress =  await directory.getMerkleClaimStreamerAddress();

    const rocketStorage = new ethers.Contract(rocketStorageAddress, ROCKET_STORAGE_ABI, provider);
    const merkleClaimStreamer = new ethers.Contract(merkleClaimStreamerAddress, MERKLE_CLAIM_STREAMER_ABI, signer);

    // Arrays to accumulate all claims
    let rewardIndexes = [];
    let amountsRPL = [];
    let amountsETH = [];
    let merkleProofsArray = [];

    try {
        // Fetch reward files from GitHub
        const rewardFiles = await fetchRewardFiles();

        // Sort files by interval number and only process the last NUM_FILES_PROCESS files
        rewardFiles.sort((a, b) => {
            const aInterval = parseInt(a.name.match(/(\d+)\.json$/)[1], 10);
            const bInterval = parseInt(b.name.match(/(\d+)\.json$/)[1], 10);
            return aInterval - bInterval;
        });
        const filesToProcess = rewardFiles.slice(-NUM_FILES_PROCESS);

        // Loop over each reward file and collect data for all claims
        for (const file of filesToProcess) {
            // Extract interval from filenames like 'rp-rewards-holesky-124.json' or 'rp-rewards-holesky-999.json'
            const intervalMatch = file.name.match(new RegExp(`rp-rewards-${NETWORK}-(\\d+)\\.json`));

            if (!intervalMatch) {
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
                continue; // Skip to the next interval
            }

            const superNodeAddress = await directory.getSuperNodeAddress()
            // Create the key for checking whether the reward has been claimed
            const claimedWordKey = ethers.utils.solidityKeccak256(
                ['string', 'address', 'uint256'],
                ['rewards.interval.claimed', superNodeAddress, indexWordIndex]
            );

            // Get the claimedWord for this interval
            const claimedWord = await rocketStorage.getUint(claimedWordKey);
            // Check if the reward has been claimed
            if (isClaimed(claimedWord, indexBitIndex)) {
                continue; // Skip to the next interval
            }

            // Reward hasn't been claimed, fetch the file content
            const rewardData = await fetchRewardFileContent(file.download_url);

            const { rewardsFileVersion } = rewardData;

            // Process rewards based on the version of the file
            let rewardsInfo;
            try {
                rewardsInfo = processRewardsForVersion(rewardData, rewardsFileVersion, superNodeAddress.toLowerCase());
            } catch (error) {
                continue;
            }

            if (rewardsInfo === null) {
                continue; // Skip to the next interval
            }

            const { merkleProof, collateralRpl, oracleDaoRpl, smoothingPoolEth } = rewardsInfo;
            const totalRplReward = ethers.BigNumber.from(collateralRpl).add(oracleDaoRpl);

            console.log(`Adding reward from interval ${interval}`);

            // Accumulate claims data for batch submission
            rewardIndexes.push(interval);
            amountsRPL.push(totalRplReward.toString());
            amountsETH.push(smoothingPoolEth);
            merkleProofsArray.push(merkleProof);
        }

        if (rewardIndexes.length === 0)
            console.log('No rewards to claim');
            return;
    } catch (error) {
        throw new Error(`Error processing rewards: ${error.message}`);
    }

    // Submit all claims in a single transaction
    try {
        console.log(`Submitting batch Merkle claim for ${rewardIndexes.length} intervals...`);
        // use the callStatic line for local testing, the other for deployment
        // const txResult = await merkleClaimStreamer.callStatic.submitMerkleClaim(
        //     rewardIndexes,
        //     amountsRPL,
        //     amountsETH,
        //     merkleProofsArray,
        //     { maxFeePerGas: 200, gasLimit: 1000000 }
        // );
        const txResult = await merkleClaimStreamer.submitMerkleClaim(
            rewardIndexes,
            amountsRPL,
            amountsETH,
            merkleProofsArray,
            { maxFeePerGas: 200, gasLimit: 1000000 }
        );
        await txResult.wait();

        if(txResult.status === 0)
            throw new Error(`Transaction reverted: ${txResult}`)
        console.log(`Transaction successful: ${txResult}`);

        // uncomment this for deployment
        return txResult.hash;
    } catch (error) {
        throw new Error(`Error submitting Merkle claim: ${error.message}`);
    }

};