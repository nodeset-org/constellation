#!/bin/bash
DATA_FILE="dist/contracts.data"
SECRET_NAMESPACE="dev/goerli"
BUCKET_NAME="constellation-metadata"
if ! aws s3 ls "s3://$BUCKET_NAME" > /dev/null 2>&1; then
    "Creating constellation data bucket"
    aws s3 mb "s3://$BUCKET_NAME"
fi
pwd
ls
aws s3 cp "$DATA_FILE" "s3://$BUCKET_NAME/"
while IFS= read -r line; do
  key="${line%%:*}"
  aws secretsmanager create-secret --name "$SECRET_NAMESPACE/$key" --secret-string "$line" --overwrite
done < "$DATA_FILE"
