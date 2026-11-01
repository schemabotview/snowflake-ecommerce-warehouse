#!/usr/bin/env bash
# Run snow sql as the loader: its own user, its own key, its own role.
exec snow sql --user SVC_LOADER --authenticator SNOWFLAKE_JWT \
  --private-key-file ~/.keys/svc_loader.p8 \
  --role LOADER --warehouse WH_LOAD --database RAW --schema SHOPWAVE "$@"
