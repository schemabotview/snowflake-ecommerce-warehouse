#!/usr/bin/env bash
# Run snow sql as Brightline's admin, IN Brightline's reader account.
# The first time, log in once with the password and register a key pair.
set -euo pipefail
ask() { snow sql --format json -q "SELECT $1 AS V" \
  | python3 -c "import json, sys; print(json.load(sys.stdin)[0]['V'])"; }
provider=$(ask "CURRENT_ACCOUNT()")
reader="$(ask "CURRENT_ORGANIZATION_NAME()")-BRIGHTLINE"  # org-account
key=~/.keys/brightline.p8
if [ ! -f "$key" ]; then
  (umask 077; openssl genrsa 2048 2>/dev/null \
    | openssl pkcs8 -topk8 -nocrypt -out "$key")
  pub=$(openssl rsa -in "$key" -pubout 2>/dev/null | grep -v -- ----- \
    | tr -d '\n')
  for try in $(seq 30); do  # a new reader account takes a while to open
    snow sql -x --account "$reader" --user BRIGHTLINE_ADMIN \
      --password "Bl7-$(cat ~/.keys/brightline.pw)" \
      -q "ALTER USER BRIGHTLINE_ADMIN SET RSA_PUBLIC_KEY = '$pub'" \
      > /dev/null 2>&1 && break
    sleep 10
  done
fi
exec snow sql -x --account "$reader" --user BRIGHTLINE_ADMIN \
  --authenticator SNOWFLAKE_JWT --private-key-file "$key" \
  -D "provider=$provider" "$@"
