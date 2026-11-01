-- A query that needs compute wakes the warehouse.
USE WAREHOUSE WH_LOAD;
SHOW WAREHOUSES LIKE 'WH_LOAD' ->> SELECT "name", "size", "state" FROM $1;
SELECT SUM(O_TOTALPRICE) AS total FROM SNOWFLAKE_SAMPLE_DATA.TPCH_SF1.ORDERS;
SHOW WAREHOUSES LIKE 'WH_LOAD' ->> SELECT "name", "size", "state" FROM $1;
