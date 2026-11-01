#!/usr/bin/env bash
# The reader account's locator, from SHOW MANAGED ACCOUNTS.
snow sql --role ACCOUNTADMIN --format json -q "SHOW MANAGED ACCOUNTS" \
  | python3 -c "
import json, sys
for r in json.load(sys.stdin):
    r = {k.lower(): v for k, v in r.items()}
    if r.get('account_name', r.get('name')) == 'BRIGHTLINE':
        print(r.get('account_locator', r.get('locator')))"
