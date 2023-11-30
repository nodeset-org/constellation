set -e
BUCKET_NAME="constellation"
BUCKET_DIR="contract_addresses"
LOCAL_FILE="contract_addresses.data"
DATA_FILE="$BUCKET_DIR/$LOCAL_FILE"
CONTRACT_NAMES=("All Contracts" "WETH" "UNISWAP_V3_POOL" "WHITELIST" "VCWETH" "VCRPL" "DEPOSIT_POOL" "OPERATOR_DISTRIBUTOR" "YIELD_DISTRIBUTOR" "ORACLE_MOCK" "PRICE_FETCHER" "DIRECTORY")

echo "Select the contract to search:"
PS3="Enter your choice: "
select CONTRACT_NAME in "${CONTRACT_NAMES[@]}"; do
    if [ -n "$CONTRACT_NAME" ]; then
        echo "Getting contract metadata for $CONTRACT_NAME"
    else
        echo "Invalid choice. Please try again."
    fi
    break
done

if [ -n "$CONTRACT_NAME" ]; then
    echo "Querying for $CONTRACT_NAME"
    echo "Downloading updated file..."
    TMP_FILE="$LOCAL_FILE.tmp"
    STATUS_CODE=$(curl -o "$TMP_FILE" -w '%{http_code}' "https://$BUCKET_NAME.s3.amazonaws.com/$DATA_FILE")
    if [ "$STATUS_CODE" -eq 200 ]; then
      echo "Download successful. Updating local file."
      mv "$TEMP_FILE" "$LOCAL_FILE"
    else
      echo "Warning: failed to download file. Status code: $STATUS_CODE"
      echo "Attempting to query local existing contract_address.data"
    fi

    if [ "$CONTRACT_NAME" == "All Contracts" ]; then
        cat "$LOCAL_FILE"
    else
        grep "$CONTRACT_NAME" "$LOCAL_FILE" || grep "AccessDenied" "$LOCAL_FILE"
    fi
    rm "$TEMP_FILE" > /dev/null 2>&1
fi
