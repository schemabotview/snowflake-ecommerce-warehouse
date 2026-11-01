#!/usr/bin/env bash
# Log in as a service user with its private key: who does Snowflake see?
user=$1 role=$2
snow sql --user "${user^^}" --authenticator SNOWFLAKE_JWT \
  --private-key-file ~/.keys/"$user".p8 --role "$role" \
  -q "SELECT CURRENT_USER() AS who, CURRENT_ROLE() AS role"
