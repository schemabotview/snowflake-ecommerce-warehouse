#!/usr/bin/env bash
# A key pair for each service user. The private key never leaves ~/.keys;
# Snowflake is given only the public half.
set -euo pipefail
mkdir -p ~/.keys && chmod 700 ~/.keys
for user in svc_loader svc_dbt; do
  openssl genrsa 2048 2>/dev/null |
    openssl pkcs8 -topk8 -nocrypt -out ~/.keys/$user.p8
  chmod 600 ~/.keys/$user.p8
  # The public key, as one line: what RSA_PUBLIC_KEY takes.
  openssl rsa -in ~/.keys/$user.p8 -pubout 2>/dev/null |
    grep -v -- '-----' | tr -d '\n' > ~/.keys/$user.pub
  echo "$user: key pair in ~/.keys"
done
snow sql -f setup/service_users.sql \
  -D "loader_key=$(cat ~/.keys/svc_loader.pub)" \
  -D "dbt_key=$(cat ~/.keys/svc_dbt.pub)"
