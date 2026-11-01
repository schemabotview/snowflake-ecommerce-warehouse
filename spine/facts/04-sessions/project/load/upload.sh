#!/usr/bin/env bash
# Upload everything under data/raw to the stage, folders kept.
set -euo pipefail
mkdir -p logs
snow stage copy data/raw @RAW.SHOPWAVE.LANDING --recursive --parallel 8 \
  --database RAW --schema SHOPWAVE \
  --user SVC_LOADER --authenticator SNOWFLAKE_JWT \
  --private-key-file ~/.keys/svc_loader.p8 --role LOADER \
  > logs/upload.log 2>&1
echo "uploaded: $(grep -c ' UPLOADED ' logs/upload.log) of" \
  "$(find data/raw -type f | wc -l) files, $(du -sh data/raw | cut -f1)"
