#!/bin/bash
DATA_FILE="../dist/contract_addresses.data"
SECRET_NAMESPACE="dev/goerli"
BUCKET_NAME="constellation/contract_address"

# Check if S3 bucket exists
if ! aws s3 ls "s3://$BUCKET_NAME" > /dev/null 2>&1 ; then
  # Create the S3 bucket if it doesn't exist
  aws s3 mb "s3://$BUCKET_NAME"
fi

# Upload the file to the S3 bucket
aws s3 cp "$DATA_FILE" "s3://$BUCKET_NAME/"

# Read each line from the data file
while IFS= read -r line; do
  key="${line%%=*}"
  value="${line#*=}"
  # Create a secret in AWS Secrets Manager with the key as the secret name and the value as the secret value
  aws secretsmanager create-secret --name "$SECRET_NAMESPACE/$key" --secret-string "$value" --overwrite
done < "$DATA_FILE"
