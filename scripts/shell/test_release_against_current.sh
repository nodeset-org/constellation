#!/bin/bash

set -e  # Exit on error

# Capture the original working directory
ORIGINAL_DIR=$(pwd)

# Kill any process using port 8545 (Hardhat's default port)
if lsof -i :8545 &> /dev/null; then
  kill -9 $(lsof -t -i :8545)
fi

# Install dependencies for the current branch
npm install

# Run Hardhat node in the background
npx hardhat node > hardhat_node.log 2>&1 &

# Store the PID of the background process
HARDHAT_PID=$!

# Give Hardhat node some time to start (e.g., 5 seconds)
sleep 5

# Get the latest tag from the local repository
LATEST_TAG=$(git tag | sort -V | tail -n 1)

if [ -z "$LATEST_TAG" ]; then
  echo "No tags found in the local repository. Skipping tag operations."
else
  # Clone the latest tag into a separate directory
  git clone --branch $LATEST_TAG . tag-repo
  cd tag-repo
  npm install

  # Run Hardhat script on localhost
  npx hardhat run ./scripts/sandbox.ts --network localhost > sandbox_deployment.log

  # Extract relevant proxy addresses from the deployment log
  ADDRESSES=$(grep -Eo '(whitelistProxy|vCWETHProxy|vCRPLProxy|operatorDistributorProxy|merkleClaimStreamerProxy|yieldDistributorProxy|priceFetcherProxy|snap)\.address\s0x[a-fA-F0-9]{40}|directory deployed to\s0x[a-fA-F0-9]{40}' sandbox_deployment.log | awk '{print $NF}')

  # Move back to the original branch directory and delete tag-repo
  cd "$ORIGINAL_DIR"
  rm -rf tag-repo
fi

# Hardcoded factory names in the same order as the deployment addresses
FACTORY_NAMES=(
  "Whitelist"
  "WETHVault"
  "RPLVault"
  "OperatorDistributor"
  "MerkleClaimStreamer"
  "NodeSetOperatorRewardDistributor"
  "PriceFetcher"
  "SuperNodeAccount"
  "Directory"
)

# Convert addresses and factory names into arrays
ADDRESS_ARRAY=($ADDRESSES)
NUM_ADDRESSES=${#ADDRESS_ARRAY[@]}

# Ensure that the number of addresses matches the number of factory names
if [ $NUM_ADDRESSES -ne ${#FACTORY_NAMES[@]} ]; then
  echo "Error: The number of extracted addresses ($NUM_ADDRESSES) does not match the number of factory names (${#FACTORY_NAMES[@]})."
  exit 1
fi

# Iterate over the extracted addresses and hardcoded factory names to deploy and upgrade
for (( i=0; i<$NUM_ADDRESSES; i++ )); do
  PROXY_ADDRESS=${ADDRESS_ARRAY[$i]}
  FACTORY_NAME=${FACTORY_NAMES[$i]}
  
  echo "Running deployAndUpgrade for proxy: $PROXY_ADDRESS and factory: $FACTORY_NAME"
  npx hardhat deployAndUpgrade --proxy $PROXY_ADDRESS --factory $FACTORY_NAME --network localhost | tee -a deploy_upgrade_output.log
done

# Kill the Hardhat node process
kill $HARDHAT_PID

# Extract and print all addresses from the deploy and upgrade process
echo "Extracted Addresses:"
grep -E "deployed to|address" deploy_upgrade_output.log
