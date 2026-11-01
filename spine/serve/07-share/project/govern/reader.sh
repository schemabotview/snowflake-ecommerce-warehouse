#!/usr/bin/env bash
# Brightline has no Snowflake account of its own: Shopwave creates a READER
# account for it (Shopwave owns it and pays for its compute), then adds it
# to the share. The admin's password is generated, kept in ~/.keys, never
# printed; as-brightline.sh swaps it for a key pair on first use.
set -euo pipefail
pw=~/.keys/brightline.pw
if [ ! -f "$pw" ]; then
  (umask 077; python3 -c "import secrets; print(secrets.token_urlsafe(24))" \
    > "$pw")
  snow sql --role ACCOUNTADMIN -q "CREATE MANAGED ACCOUNT BRIGHTLINE
    ADMIN_NAME = BRIGHTLINE_ADMIN, ADMIN_PASSWORD = 'Bl7-$(cat "$pw")',
    TYPE = READER" > /dev/null
fi
locator=$(bash govern/reader_locator.sh)
echo "reader account BRIGHTLINE: locator $locator"
snow sql --role ACCOUNTADMIN \
  -q "ALTER SHARE SHOPWAVE_CAMPAIGNS ADD ACCOUNTS = $locator"
snow sql --role ACCOUNTADMIN -q "SHOW SHARES LIKE 'SHOPWAVE_CAMPAIGNS'
  ->> SELECT \"kind\", \"name\", \"to\" FROM \$1"
