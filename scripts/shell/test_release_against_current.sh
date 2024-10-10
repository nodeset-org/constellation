#!/bin/bash


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

# Accept an optional tag parameter
if [ "$#" -eq 1 ]; then
  SELECTED_TAG="$1"
  echo "Using provided tag: $SELECTED_TAG"
else
  # Get all tags, sorted
  echo "Retrieving all Git tags..."
  TAGS=($(git tag | sort -V))
  echo "Tags found: ${TAGS[@]}"

  # Check if there are any tags
  if [ ${#TAGS[@]} -gt 0 ]; then
    # Select the latest tag
    SELECTED_TAG=${TAGS[${#TAGS[@]}-1]}
    echo "No tag provided. Using the latest tag: $SELECTED_TAG"
  else
    echo "No tags found in the local repository. Exiting."
    exit 1
  fi
fi

echo "Recap: Using tag '$SELECTED_TAG' for testing."

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

# Initialize arrays to store contracts with errors and their messages
STORAGE_ERRORS=()
STORAGE_ERROR_MESSAGES=()
OTHER_ERRORS=()
OTHER_ERROR_MESSAGES=()

# Iterate over the extracted addresses and hardcoded factory names to deploy and upgrade
for (( i=0; i<$NUM_ADDRESSES; i++ )); do
  PROXY_ADDRESS=${ADDRESS_ARRAY[$i]}
  FACTORY_NAME=${FACTORY_NAMES[$i]}

  echo "Running deployAndUpgrade for proxy: $PROXY_ADDRESS and factory: $FACTORY_NAME"

  # Run the command and capture output and error message
  OUTPUT=$(npx hardhat deployAndUpgrade --proxy $PROXY_ADDRESS --factory $FACTORY_NAME --network localhost 2>&1 | tee -a deploy_upgrade_output.log)

  # Check for storage layout incompatibility error
  if echo "$OUTPUT" | grep -q "Error: New storage layout is incompatible"; then
    echo "Storage layout incompatibility error in $FACTORY_NAME"
    STORAGE_ERRORS+=("$FACTORY_NAME")
    # Extract the error message
    ERROR_MSG=$(echo "$OUTPUT" | grep -A5 -m1 "Error: New storage layout is incompatible")
    STORAGE_ERROR_MESSAGES+=("$ERROR_MSG")
  elif echo "$OUTPUT" | grep -q "An error occurred during the upgrade"; then
    echo "Error occurred during upgrade of $FACTORY_NAME"
    # Extract the error message
    ERROR_MSG=$(echo "$OUTPUT" | grep -A10 -m1 "An error occurred during the upgrade")
    OTHER_ERRORS+=("$FACTORY_NAME")
    OTHER_ERROR_MESSAGES+=("$ERROR_MSG")
  fi
done

# Kill the Hardhat node process
echo "Killing Hardhat node process with PID: $HARDHAT_PID"
kill $HARDHAT_PID

# Extract and print all addresses from the deploy and upgrade process
echo "Extracting addresses from deploy and upgrade output:"
grep -E "deployed to|address" deploy_upgrade_output.log

# Output the recap of the tag used
echo -e "\n========== SUMMARY =========="
echo -e "Recap: The tag used for testing was '$SELECTED_TAG'"

# Output the summary of errors
echo -e "\n========== SUMMARY OF ERRORS =========="

if [ ${#STORAGE_ERRORS[@]} -gt 0 ]; then
  echo -e "\nContracts with **Storage Layout Incompatibility** errors:"
  for idx in "${!STORAGE_ERRORS[@]}"; do
    CONTRACT="${STORAGE_ERRORS[$idx]}"
    ERROR_MSG="${STORAGE_ERROR_MESSAGES[$idx]}"
    echo -e "\n--- $CONTRACT ---"
    echo -e "$ERROR_MSG"
  done
else
  echo -e "\nNo contracts reported storage layout incompatibility errors."
fi

if [ ${#OTHER_ERRORS[@]} -gt 0 ]; then
  echo -e "\nContracts with **Other Errors**:"
  for idx in "${!OTHER_ERRORS[@]}"; do
    CONTRACT="${OTHER_ERRORS[$idx]}"
    ERROR_MSG="${OTHER_ERROR_MESSAGES[$idx]}"
    echo -e "\n--- $CONTRACT ---"
    echo -e "$ERROR_MSG"
  done
else
  echo -e "\nNo contracts reported other errors."
fi

echo -e "\n========== END OF SUMMARY =========="
