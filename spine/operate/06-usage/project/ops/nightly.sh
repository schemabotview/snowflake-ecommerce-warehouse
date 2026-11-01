#!/usr/bin/env bash
# Run tonight's job now: start the graph's root, wait until one more run of
# the whole graph has finished, then read what it did.
set -euo pipefail
sf() { bash model/as-transformer.sh "$@"; }
runs() { sf --format json -q "SELECT COUNT(*) AS N
  FROM TABLE(INFORMATION_SCHEMA.COMPLETE_TASK_GRAPHS(
  ROOT_TASK_NAME => 'NIGHTLY_SNAPSHOT'))" \
  | python3 -c 'import json, sys; print(json.load(sys.stdin)[0]["N"])'; }
before=$(runs)
sf -q "EXECUTE TASK NIGHTLY_SNAPSHOT"
until [ "$(runs)" -gt "$before" ]; do sleep 20; done
echo "the task graph has finished"
sf -f ops/history.sql
