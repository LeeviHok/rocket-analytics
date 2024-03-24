#!/bin/bash
set -Eeuxo pipefail

REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/region)

main () {
    local postgres_user_secret
    local username
    local password
    local database_name

    postgres_user_secret=$(aws secretsmanager get-secret-value \
        --secret-id PostgresUser --region $REGION --query SecretString \
        --output text)

    username=$(echo $postgres_user_secret | jq -r .username)
    password=$(echo $postgres_user_secret | jq -r .password)

    database_name=$(get_ssm_parameter "PostgresDatabase")

    psql -v ON_ERROR_STOP=1 --username postgres --dbname $database_name <<-EOSQL
        CREATE USER $username WITH PASSWORD '$password';
        ALTER DATABASE $database_name OWNER TO $username;
EOSQL
}

# $1: Parameter name
get_ssm_parameter () {
  echo $(aws ssm get-parameter --name $1 --region $REGION \
    --query 'Parameter.Value' --output text)
}

main
