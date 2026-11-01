#!/usr/bin/env bash
# A year of nights, compressed: the shop's customers table as it stood at
# the start of 2026 and at each month end, and a dbt snapshot of each.
set -euo pipefail
for day in 2025-12-31 $(for m in $(seq -w 1 12); do
    date -d "2026-$m-01 +1 month -1 day" +%F; done); do
  bash load/as-loader.sh -f load/customers_as_of.sql -D "day=$day" \
    > /dev/null
  (cd dbt && dbt --quiet snapshot)
  echo "$day: CUSTOMER_STATE replicated, snapshot taken"
done
