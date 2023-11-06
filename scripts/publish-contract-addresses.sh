#!/bin/bash
DATA_FILE="../dist/contract_addresses.data"
SECRET_NAMESPACE="dev/goerli"

while IFS= read -r line; do
  key="${line%%=*}"
  value="${line#*=}"
  # Create a secret in AWS Secrets Manager with the key as the secret name and the value as the secret value
  aws secretsmanager create-secret --name "$SECRET_NAMESPACE/$key" --secret-string "$value" --overwrite
done < "$DATA_FILE"
