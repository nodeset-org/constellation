#!/bin/bash
SECRET_NAMESPACE="dev/goerli"

# List all secrets within the specified namespace
secrets_list=$(aws secretsmanager list-secrets --query "SecretList[?starts_with(Name, '$SECRET_NAMESPACE/')].[Name]" --output text)

# Loop through the list of secret names and retrieve their values
for secret_name in $secrets_list; do
  secret_value=$(aws secretsmanager get-secret-value --secret-id "$secret_name" --query "SecretString" --output text)
  echo "Secret Name: $secret_name"
  #echo "Secret Value: $secret_value"
done
