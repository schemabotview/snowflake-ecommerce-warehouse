#!/usr/bin/env bash
# Run snow sql as Ana, working as the analytics team: TRANSFORMER.
exec snow sql --role TRANSFORMER --warehouse WH_TRANSFORM \
  --database ANALYTICS --schema MARTS "$@"
