#!/bin/bash

set -e 
set -x 

# Capture the original working directory
ORIGINAL_DIR=$(pwd)
echo "Original directory: $ORIGINAL_DIR"

# Kill any process using port 8545 (Hardhat's default port)
echo "Checking for processes using port 8545..."
if lsof -i :8545 &> /dev/null; then
  echo "Found process using port 8545. Killing it..."
  kill -9 $(lsof -t -i :8545)
else
  echo "No process using port 8545 found."
fi

# Install dependencies for the current branch
echo "Installing dependencies for the current branch..."
npm install

# Run Hardhat node in the background
echo "Starting Hardhat node in the background..."
npx hardhat node > hardhat_node.log 2>&1 &

# Store the PID of the background process
HARDHAT_PID=$!
echo "Hardhat node started with PID: $HARDHAT_PID"

echo "Waiting 5 seconds for Hardhat node to start..."
sleep 5

# Get all tags, sorted
echo "Retrieving all Git tags..."
TAGS=($(git tag | sort -V))
echo "Tags found: ${TAGS[@]}"

# Set the index of the tag you want (0 for the first tag, 1 for the second, etc.)
TAG_INDEX=1 
echo "Tag index set to: $TAG_INDEX"

# Check if TAG_INDEX is within bounds
if [ $TAG_INDEX -ge 0 ] && [ $TAG_INDEX -lt ${#TAGS[@]} ]; then
  SELECTED_TAG=${TAGS[$TAG_INDEX]}
  echo "Selected tag: $SELECTED_TAG"
else
  echo "Invalid TAG_INDEX: $TAG_INDEX"
  exit 1
fi

if [ -z "$SELECTED_TAG" ]; then
  echo "No tags found in the local repository. Skipping tag operations."
else
  # Clone the selected tag into a separate directory
  echo "Cloning repository at tag '$SELECTED_TAG' into 'tag-repo'..."
  git clone --branch $SELECTED_TAG . tag-repo
  if [ $? -ne 0 ]; then
    echo "Error: Failed to clone repository at tag '$SELECTED_TAG'."
    exit 1
  fi

  echo "Changing directory to 'tag-repo'..."
  cd tag-repo

  echo "Installing dependencies in 'tag-repo'..."
  npm install

  # Run Hardhat script on localhost
  echo "Running Hardhat script 'sandbox.ts' on localhost..."
  npx hardhat run ./scripts/sandbox.ts --network localhost > sandbox_deployment.log

  # Check if the deployment log was created
  if [ -f sandbox_deployment.log ]; then
    echo "Deployment log created successfully."
  else
    echo "Error: Deployment log was not created."
    exit 1
  fi

  # Extract relevant proxy addresses from the deployment log
  echo "Extracting proxy addresses from deployment log..."
  ADDRESSES=$(grep -Eo '(whitelistProxy|vCWETHProxy|vCRPLProxy|operatorDistributorProxy|merkleClaimStreamerProxy|yieldDistributorProxy|priceFetcherProxy|snap)\.address\s0x[a-fA-F0-9]{40}|directory deployed to\s0x[a-fA-F0-9]{40}' sandbox_deployment.log | awk '{print $NF}')
  echo "Addresses extracted: $ADDRESSES"

  # Move back to the original branch directory and delete tag-repo
  echo "Moving back to the original directory..."
  cd "$ORIGINAL_DIR"
  echo "Deleting 'tag-repo' directory..."
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
echo "Factory names: ${FACTORY_NAMES[@]}"

# Convert addresses and factory names into arrays
ADDRESS_ARRAY=($ADDRESSES)
NUM_ADDRESSES=${#ADDRESS_ARRAY[@]}
echo "Number of addresses extracted: $NUM_ADDRESSES"
echo "Address array: ${ADDRESS_ARRAY[@]}"

# Ensure that the number of addresses matches the number of factory names
if [ $NUM_ADDRESSES -ne ${#FACTORY_NAMES[@]} ]; then
  echo "Error: The number of extracted addresses ($NUM_ADDRESSES) does not match the number of factory names (${#FACTORY_NAMES[@]})."
  exit 1
else
  echo "The number of addresses matches the number of factory names."
fi

# Iterate over the extracted addresses and hardcoded factory names to deploy and upgrade
for (( i=0; i<$NUM_ADDRESSES; i++ )); do
  PROXY_ADDRESS=${ADDRESS_ARRAY[$i]}
  FACTORY_NAME=${FACTORY_NAMES[$i]}
  
  echo "Running deployAndUpgrade for proxy: $PROXY_ADDRESS and factory: $FACTORY_NAME"
  npx hardhat deployAndUpgrade --proxy $PROXY_ADDRESS --factory $FACTORY_NAME --network localhost | tee -a deploy_upgrade_output.log
done

# Kill the Hardhat node process
echo "Killing Hardhat node process with PID: $HARDHAT_PID"
kill $HARDHAT_PID

# Extract and print all addresses from the deploy and upgrade process
echo "Extracting addresses from deploy and upgrade output:"
grep -E "deployed to|address" deploy_upgrade_output.log
