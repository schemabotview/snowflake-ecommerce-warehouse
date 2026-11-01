-- A new account, asked before any warehouse runs.
SELECT CURRENT_VERSION() AS version;
SHOW WAREHOUSES ->> SELECT "name", "size", "state" FROM $1;
SHOW DATABASES ->> SELECT "name", "kind" FROM $1;
SELECT COUNT(*) AS orders FROM SNOWFLAKE_SAMPLE_DATA.TPCH_SF1.ORDERS;
