#!/usr/bin/env bash
# What CI runs for a pull request (ops/ci.yml): clone production, build
# and test the change on the clone, drop the clone. Run here step by step.
set -euo pipefail
db=ANALYTICS_CI_${PR:?the pull request number}
sf() { bash model/as-transformer.sh "$@"; }
sf -q "CREATE OR REPLACE DATABASE $db CLONE ANALYTICS"
(cd dbt && CI_DATABASE=$db dbt build --target ci --select mart_revenue+)
sf -q "DROP DATABASE $db"
