#!/bin/bash

# Script Name: test_release_against_current.sh
# Description:
#   Tests the current branch against a specified Git tag by deploying contracts,
#   performing upgrades, and reporting any storage layout incompatibility or other errors.

# set -e  # Exit immediately if a command exits with a non-zero status.

# Constants
HARDHAT_PORT=8545
HARDHAT_LOG="hardhat_node.log"
SANDBOX_SCRIPT="./scripts/sandbox.ts"
TAG_REPO_DIR="tag-repo"
DEPLOY_UPGRADE_LOG="deploy_upgrade_output.log"

# Function Definitions

# Prints a header message
print_header() {
  echo -e "\n========== $1 =========="
}

# Kills any process using the specified port
kill_process_on_port() {
  local port="$1"
  if lsof -i :"$port" &> /dev/null; then
    echo "Found process using port $port. Killing it..."
    kill -9 $(lsof -t -i :"$port")
  else
    echo "No process using port $port found."
  fi
}

# Starts the Hardhat node in the background
start_hardhat_node() {
  echo "Starting Hardhat node on port $HARDHAT_PORT..."
  npx hardhat node > "$HARDHAT_LOG" 2>&1 &
  HARDHAT_PID=$!
  echo "Hardhat node started with PID: $HARDHAT_PID"
}

# Stops the Hardhat node
stop_hardhat_node() {
  if [ -n "$HARDHAT_PID" ]; then
    echo "Stopping Hardhat node with PID: $HARDHAT_PID"
    kill "$HARDHAT_PID"
  fi
}

# Retrieves the Git tag to use for testing
get_selected_tag() {
  if [ -n "$1" ]; then
    SELECTED_TAG="$1"
    echo "Using provided tag: $SELECTED_TAG"
  else
    echo "Retrieving all Git tags..."
    SELECTED_TAG=$(git tag | sort -V | tail -n 1)
    if [ -n "$SELECTED_TAG" ]; then
      echo "No tag provided. Using the latest tag: $SELECTED_TAG"
    else
      echo "No tags found in the local repository. Exiting."
      exit 1
    fi
  fi
}

# Clones the repository at the specified tag into a separate directory
clone_repository_at_tag() {
  echo "Cloning repository at tag '$SELECTED_TAG' into '$TAG_REPO_DIR'..."
  git clone --branch "$SELECTED_TAG" . "$TAG_REPO_DIR"
}

# Extracts proxy addresses from the deployment log
extract_proxy_addresses() {
  local log_file="$1"
  grep -Eo '(whitelistProxy|vCWETHProxy|vCRPLProxy|operatorDistributorProxy|merkleClaimStreamerProxy|yieldDistributorProxy|priceFetcherProxy|snap)\.address\s0x[a-fA-F0-9]{40}|directory deployed to\s0x[a-fA-F0-9]{40}' "$log_file" | awk '{print $NF}'
}

# Outputs errors and warnings in GitHub Actions annotation format
output_annotation() {
  local level="$1"
  local contract="$2"
  local message="$3"
  echo "::${level} file=${BASH_SOURCE[0]},line=${LINENO}::${contract}: ${message}"
}

# Main Script Execution

# Capture the original working directory
ORIGINAL_DIR=$(pwd)
echo "Original directory: $ORIGINAL_DIR"

# Clean up any previous Hardhat instances
echo "Checking for processes using port $HARDHAT_PORT..."
kill_process_on_port "$HARDHAT_PORT"

# Install dependencies for the current branch
echo "Installing dependencies for the current branch..."
npm install

# Start Hardhat node
start_hardhat_node
echo "Waiting for Hardhat node to start..."
sleep 5

# Get the Git tag to use
get_selected_tag "$1"
echo "Recap: Using tag '$SELECTED_TAG' for testing."

# Clone the repository at the selected tag
clone_repository_at_tag

# Navigate to the cloned repository
cd "$TAG_REPO_DIR"

# Install dependencies in the cloned repository
echo "Installing dependencies in '$TAG_REPO_DIR'..."
npm install

# Run the sandbox script to deploy contracts
echo "Running Hardhat script 'sandbox.ts' on localhost..."
npx hardhat run "$SANDBOX_SCRIPT" --network localhost > sandbox_deployment.log

# Check if the deployment log was created
if [ ! -f sandbox_deployment.log ]; then
  echo "Error: Deployment log was not created."
  stop_hardhat_node
  exit 1
fi

# Extract proxy addresses from the deployment log
echo "Extracting proxy addresses from deployment log..."
ADDRESSES=$(extract_proxy_addresses "sandbox_deployment.log")
echo "Addresses extracted:"
echo "$ADDRESSES"

# Return to the original directory and clean up
cd "$ORIGINAL_DIR"
echo "Deleting '$TAG_REPO_DIR' directory..."
rm -rf "$TAG_REPO_DIR"

# Define factory names corresponding to the addresses
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

# Convert addresses into an array
ADDRESS_ARRAY=()
while IFS= read -r line; do
  ADDRESS_ARRAY+=("$line")
done <<< "$ADDRESSES"

# Debugging: Print the number of addresses and the array elements
echo "Number of addresses extracted: ${#ADDRESS_ARRAY[@]}"
echo "Address array:"
for addr in "${ADDRESS_ARRAY[@]}"; do
  echo "$addr"
done

# Check if the number of addresses matches the number of factory names
if [ ${#ADDRESS_ARRAY[@]} -ne ${#FACTORY_NAMES[@]} ]; then
  echo "Error: The number of extracted addresses (${#ADDRESS_ARRAY[@]}) does not match the number of factory names (${#FACTORY_NAMES[@]})."
  stop_hardhat_node
  exit 1
fi

# Initialize arrays for errors
STORAGE_ERRORS=()
STORAGE_ERROR_MESSAGES=()
OTHER_ERRORS=()
OTHER_ERROR_MESSAGES=()

# Iterate over addresses and factory names to perform upgrades
for i in "${!ADDRESS_ARRAY[@]}"; do
  PROXY_ADDRESS="${ADDRESS_ARRAY[$i]}"
  FACTORY_NAME="${FACTORY_NAMES[$i]}"

  echo "Upgrading contract '$FACTORY_NAME' at proxy address '$PROXY_ADDRESS'..."

  # Run the deployAndUpgrade command and capture output
  OUTPUT=$(npx hardhat deployAndUpgrade --proxy "$PROXY_ADDRESS" --factory "$FACTORY_NAME" --network localhost 2>&1)

  # Append output to log file
  echo "$OUTPUT" >> "$DEPLOY_UPGRADE_LOG"

  # Check for storage layout incompatibility errors
  if echo "$OUTPUT" | grep -q "Error: New storage layout is incompatible"; then
    echo "Storage layout incompatibility error in $FACTORY_NAME"
    STORAGE_ERRORS+=("$FACTORY_NAME")
    ERROR_MSG=$(echo "$OUTPUT" | grep -A5 -m1 "Error: New storage layout is incompatible")
    STORAGE_ERROR_MESSAGES+=("$ERROR_MSG")
  elif echo "$OUTPUT" | grep -q "An error occurred during the upgrade"; then
    echo "Error occurred during upgrade of $FACTORY_NAME"
    OTHER_ERRORS+=("$FACTORY_NAME")
    ERROR_MSG=$(echo "$OUTPUT" | grep -A10 -m1 "An error occurred during the upgrade")
    OTHER_ERROR_MESSAGES+=("$ERROR_MSG")
  fi
done

# Stop the Hardhat node
stop_hardhat_node

# Extract and print all addresses from the deploy and upgrade process
print_header "DEPLOY AND UPGRADE OUTPUT"
grep -E "deployed to|address" "$DEPLOY_UPGRADE_LOG" || echo "No addresses found in deploy and upgrade output."

# Output the summary
print_header "SUMMARY"
echo "Recap: The tag used for testing was '$SELECTED_TAG'"

# Initialize exit code
EXIT_CODE=0

# Output storage errors and set exit code
if [ ${#STORAGE_ERRORS[@]} -gt 0 ]; then
  print_header "STORAGE ERRORS"
  for idx in "${!STORAGE_ERRORS[@]}"; do
    CONTRACT="${STORAGE_ERRORS[$idx]}"
    ERROR_MSG="${STORAGE_ERROR_MESSAGES[$idx]}"
    echo "--- $CONTRACT ---"
    echo "$ERROR_MSG"
    output_annotation "error" "$CONTRACT" "$ERROR_MSG"
  done
  EXIT_CODE=1  # Fail the job due to storage errors
else
  echo "No contracts reported storage layout incompatibility errors."
fi

# Output other errors as warnings
if [ ${#OTHER_ERRORS[@]} -gt 0 ]; then
  print_header "OTHER ERRORS (Warnings)"
  for idx in "${!OTHER_ERRORS[@]}"; do
    CONTRACT="${OTHER_ERRORS[$idx]}"
    ERROR_MSG="${OTHER_ERROR_MESSAGES[$idx]}"
    echo "--- $CONTRACT ---"
    echo "$ERROR_MSG"
    output_annotation "warning" "$CONTRACT" "$ERROR_MSG"
  done
else
  echo "No contracts reported other errors."
fi

print_header "END OF SUMMARY"

# Exit with the appropriate code
exit $EXIT_CODE
