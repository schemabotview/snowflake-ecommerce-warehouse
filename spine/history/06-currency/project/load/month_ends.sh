#!/usr/bin/env bash
# A year of nights, compressed: at each month end, the shop's customers
# table as it then stood, and a dbt snapshot of it.
set -euo pipefail
for month in 01 02 03 04 05 06 07 08 09 10 11 12; do
  day=$(date -d "2026-$month-01 +1 month -1 day" +%F)
  bash load/as-loader.sh -f load/customers_as_of.sql -D "day=$day" \
    > /dev/null
  (cd dbt && dbt --quiet snapshot)
  echo "$day: CUSTOMER_STATE replicated, snapshot taken"
done
