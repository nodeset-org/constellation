# Test Release Against Current Script Documentation

## Introduction

The `test_release_against_current.sh` script is designed to test the current branch of a repository against a specified Git tag. It does this by:

- Deploying smart contracts from the specified tag.
- Performing upgrades using the current branch's code.
- Reporting any storage layout incompatibility or other errors that occur during the process.

This script is particularly useful for developers working with smart contracts who need to ensure that upgrades from previous versions do not introduce breaking changes.

## Prerequisites

- **Git**: The script uses Git commands to clone repositories and manage tags.
- **Node.js and npm**: Required for running Hardhat and installing dependencies.
- **Hardhat**: A development environment for Ethereum software.
- **lsof**: Used to check for processes using specific ports.

Ensure that all these tools are installed and accessible in your system's PATH.

## Script Overview

The script performs the following high-level steps:

1. Cleans up any existing Hardhat instances running on the specified port.
2. Installs dependencies for the current branch.
3. Starts a Hardhat node.
4. Clones the repository at the specified Git tag.
5. Installs dependencies in the cloned repository.
6. Deploys contracts using a sandbox script in the cloned repository.
7. Extracts proxy addresses from the deployment log.
8. Uses the current branch's code to perform upgrades on the deployed contracts.
9. Reports any storage layout incompatibilities or other errors encountered during the upgrade process.

## How to Use

### Running the Script

#### Make the Script Executable
Before running the script, ensure it has executable permissions:

```bash
chmod +x test_release_against_current.sh
```

#### Execute the Script
You can run the script without any arguments to test against the latest Git tag:

```bash
./test_release_against_current.sh
```

Alternatively, specify a particular Git tag as an argument:

```bash
./test_release_against_current.sh v1.2.3
```

### Command-Line Arguments
- **Git Tag (Optional)**: Pass a Git tag as the first argument to specify which tag to test against. If no tag is provided, the script uses the latest tag found in the repository.

```bash
./test_release_against_current.sh <git-tag>
```

### Using in GitHub Actions

We have created a GitHub Actions workflow called **TUSAPR** to automate the process of testing upgrades against a provided release. This action allows for easy manual triggering from the GitHub UI.

To use the workflow:

1. Go to the **Actions** tab in your GitHub repository.
2. Select the **TUSAPR** workflow from the list of workflows.
3. Click on **Run workflow**.
4. In the prompt that appears, you can select the branch (`main` by default) and specify an optional tag to use for the script.
5. Click on the **Run workflow** button to start the process.

Refer to the screenshot below for guidance:

This workflow (`test_upgrade_safety_release_against_current.yml`) allows developers to easily test their current branch against a specific Git tag without having to run the script manually. The workflow has the following key parts:

- **Inputs**: Accepts a `tag` input that specifies which Git tag to use for the test. If not provided, the script uses the latest tag.
- **Steps**:
  - **Checkout repository**: Uses `actions/checkout@v3` to check out the repository with the appropriate ref and history.
  - **Set up Node.js**: Uses `actions/setup-node@v3` to set up Node.js version 18.
  - **Run test release script**: Executes the script (`test_release_against_current.sh`) with the provided tag if specified.

### Example YAML Workflow

```yaml
# Test Upgrade Safety Against Provided Release
name: TUSAPR

on:
  workflow_dispatch:
    inputs:
      tag:
        description: 'Tag to use for the script'
        required: false
        default: ''

jobs:
  test-release:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
        with:
          ref: ${{ github.ref }}  # Updated to checkout the correct ref
          fetch-depth: 0          # Fetch all history and tags

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Run test release script
        run: |
          chmod +x scripts/shell/test_release_against_current.sh
          ./scripts/shell/test_release_against_current.sh ${{ github.event.inputs.tag }}
```

## Step-by-step Explanation

### Constants

The script defines several constants at the beginning:

- `HARDHAT_PORT=8545`: The port on which the Hardhat node will run.
- `HARDHAT_LOG="hardhat_node.log"`: The log file for the Hardhat node.
- `SANDBOX_SCRIPT="./scripts/sandbox.ts"`: The script used to deploy contracts.
- `TAG_REPO_DIR="tag-repo"`: Directory name where the repository at the specified tag will be cloned.
- `DEPLOY_UPGRADE_LOG="deploy_upgrade_output.log"`: Log file for the deploy and upgrade process.

### Function Definitions

#### `print_header()`
Prints a formatted header message for better readability in the script's output.

```bash
print_header() {
  echo -e "\n========== $1 =========="
}
```

#### `kill_process_on_port()`
Kills any process that is currently using the specified port. This ensures that the Hardhat node can start without port conflicts.

```bash
kill_process_on_port() {
  local port="$1"
  if lsof -i :"$port" &> /dev/null; then
    echo "Found process using port $port. Killing it..."
    kill -9 $(lsof -t -i :"$port")
  else
    echo "No process using port $port found."
  fi
}
```

#### `start_hardhat_node()`
Starts a Hardhat node in the background and logs its PID (Process ID). The node is started on the port specified by `HARDHAT_PORT`.

```bash
start_hardhat_node() {
  echo "Starting Hardhat node on port $HARDHAT_PORT..."
  npx hardhat node > "$HARDHAT_LOG" 2>&1 &
  HARDHAT_PID=$!
  echo "Hardhat node started with PID: $HARDHAT_PID"
}
```

#### `stop_hardhat_node()`
Stops the Hardhat node using its PID. This function ensures that the node is properly terminated after the script finishes.

```bash
stop_hardhat_node() {
  if [ -n "$HARDHAT_PID" ]; then
    echo "Stopping Hardhat node with PID: $HARDHAT_PID"
    kill "$HARDHAT_PID"
  fi
}
```

#### `get_selected_tag()`
Retrieves the Git tag to use for testing:

- If a tag is provided as a script argument, it uses that.
- If no tag is provided, it uses the latest tag in the repository.

```bash
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
```

#### `clone_repository_at_tag()`
Clones the repository at the specified tag into the directory defined by `TAG_REPO_DIR`.

```bash
clone_repository_at_tag() {
  echo "Cloning repository at tag '$SELECTED_TAG' into '$TAG_REPO_DIR'..."
  git clone --branch "$SELECTED_TAG" . "$TAG_REPO_DIR"
}
```

#### `extract_proxy_addresses()`
Parses the deployment log to extract proxy addresses of deployed contracts. It looks for specific patterns in the log file and collects the addresses.

```bash
extract_proxy_addresses() {
  local log_file="$1"
  grep -Eo '(whitelistProxy|vCWETHProxy|vCRPLProxy|operatorDistributorProxy|merkleClaimStreamerProxy|yieldDistributorProxy|priceFetcherProxy|snap)\.address\s0x[a-fA-F0-9]{40}|directory deployed to\s0x[a-fA-F0-9]{40}' "$log_file" | awk '{print $NF}'
}
```

#### `output_annotation()`
Outputs errors and warnings in GitHub Actions annotation format. This is useful for integrating the script with GitHub Actions workflows.

```bash
output_annotation() {
  local level="$1"
  local contract="$2"
  local message="$3"
  echo "::${level} file=${BASH_SOURCE[0]},line=${LINENO}::${contract}: ${message}"
}
```

## Main Script Execution

### 1. Capture Original Working Directory
Stores the current working directory in `ORIGINAL_DIR` for later use.

```bash
ORIGINAL_DIR=$(pwd)
echo "Original directory: $ORIGINAL_DIR"
```

### 2. Kill any Process Using the Specified Port
Ensures that no other process is using `HARDHAT_PORT` by invoking `kill_process_on_port`.

```bash
echo "Checking for processes using port $HARDHAT_PORT..."
kill_process_on_port "$HARDHAT_PORT"
```

### 3. Install Dependencies for the Current Branch
Runs `npm install` to install any required dependencies for the current codebase.

```bash
echo "Installing dependencies for the current branch..."
npm install
```

### 4. Start Hardhat Node
Starts the Hardhat node by invoking `start_hardhat_node` and waits for 5 seconds to ensure it's running.

```bash
start_hardhat_node
echo "Waiting for Hardhat node to start..."
sleep 5
```

### 5. Get the Git Tag to Use
Determines the Git tag to test against using `get_selected_tag`:

- If a tag is provided as a command-line argument, it uses that.
- If not, it uses the latest tag from `git tag`.

```bash
get_selected_tag "$1"
echo "Recap: Using tag '$SELECTED_TAG' for testing."
```

### 6. Clone the Repository at the Selected Tag
Clones the repository at the selected tag into the `TAG_REPO_DIR` directory using `clone_repository_at_tag`.

```bash
clone_repository_at_tag
```

### 7. Install Dependencies in the Cloned Repository
Changes directory to `TAG_REPO_DIR` and runs `npm install` to install dependencies for the cloned codebase.

```bash
cd "$TAG_REPO_DIR"
echo "Installing dependencies in '$TAG_REPO_DIR'..."
npm install
```

### 8. Run the Sandbox Script to Deploy Contracts
Runs the `sandbox.ts` script to deploy contracts to the local Hardhat node and logs the output to `sandbox_deployment.log`.

```bash
echo "Running Hardhat script 'sandbox.ts' on localhost..."
npx hardhat run "$SANDBOX_SCRIPT" --network localhost > sandbox_deployment.log
```

### 9. Extract Proxy Addresses from the Deployment Log
Uses `extract_proxy_addresses` to parse `sandbox_deployment.log` and extract the proxy addresses of the deployed contracts.

```bash
echo "Extracting proxy addresses from deployment log..."
ADDRESSES=$(extract_proxy_addresses "sandbox_deployment.log")
echo "Addresses extracted:"
echo "$ADDRESSES"
```

### 10. Delete the Cloned Repository
Returns to the original directory and removes the `TAG_REPO_DIR` to clean up.

```bash
cd "$ORIGINAL_DIR"
echo "Deleting '$TAG_REPO_DIR' directory..."
rm -rf "$TAG_REPO_DIR"
```

### 11. Define Factory Names Corresponding to the Addresses
Defines an array `FACTORY_NAMES` containing the names of the contract factories corresponding to the addresses extracted.

```bash
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
```

### 12. Perform Upgrades for Each Contract
Iterates over each proxy address and corresponding factory name to perform upgrades using the current branch's code:

- Runs the `deployAndUpgrade` command for each contract.
- Captures the output and appends it to `DEPLOY_UPGRADE_LOG`.
- Checks for storage layout incompatibility errors or other errors in the output.
- Collects any errors found for later reporting.

```bash
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
```

### 13. Log Any Errors
Collects storage layout incompatibility errors and other errors into separate arrays:

- `STORAGE_ERRORS` and `STORAGE_ERROR_MESSAGES` for storage layout issues.
- `OTHER_ERRORS` and `OTHER_ERROR_MESSAGES` for other types of errors.

### 14. Output the Summary
Prints a summary of the upgrade process:

- Displays any storage layout incompatibility errors.
- Outputs other errors as warnings.
- Uses `output_annotation` to format messages suitable for GitHub Actions.

```bash
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
```

### 15. Exit with the Appropriate Code
Exits the script with:

- `0` if there were no storage layout incompatibility errors.
- `1` if there were storage layout incompatibility errors, causing CI/CD pipelines to fail.

```bash
exit $EXIT_CODE
```

## Conclusion

The `test_release_against_current.sh` script automates the process of testing smart contract upgrades from a specified Git tag to the current branch. It helps developers identify storage layout incompatibilities and other issues that could prevent successful upgrades, ensuring that smart contract deployments remain robust and secure.

By understanding each step of the script, developers can customize or extend its functionality to suit their specific needs, such as integrating with different CI/CD pipelines or handling additional types of contracts.
