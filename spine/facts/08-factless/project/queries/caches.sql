-- One query, three times: cold, warm, and remembered.
-- WH_LOAD has been idle since the last step: suspended, its cache empty.
SHOW WAREHOUSES LIKE 'WH_LOAD' ->> SELECT "name", "state" FROM $1;
USE WAREHOUSE WH_LOAD;
ALTER SESSION SET USE_CACHED_RESULT = FALSE;
ALTER SESSION SET QUERY_TAG = '1 cold';
SELECT l_returnflag, l_linestatus, SUM(l_quantity), AVG(l_discount)
FROM SNOWFLAKE_SAMPLE_DATA.TPCH_SF1.LINEITEM GROUP BY 1, 2;
ALTER SESSION SET QUERY_TAG = '2 warm';
SELECT l_returnflag, l_linestatus, SUM(l_quantity), AVG(l_discount)
FROM SNOWFLAKE_SAMPLE_DATA.TPCH_SF1.LINEITEM GROUP BY 1, 2;
ALTER SESSION SET USE_CACHED_RESULT = TRUE;
ALTER SESSION SET QUERY_TAG = '3 result';
SELECT l_returnflag, l_linestatus, SUM(l_quantity), AVG(l_discount)
FROM SNOWFLAKE_SAMPLE_DATA.TPCH_SF1.LINEITEM GROUP BY 1, 2;
SELECT l_returnflag, l_linestatus, SUM(l_quantity), AVG(l_discount)
FROM SNOWFLAKE_SAMPLE_DATA.TPCH_SF1.LINEITEM GROUP BY 1, 2;
SELECT query_tag AS run, total_elapsed_time AS elapsed_ms,
       bytes_scanned, execution_time AS execution_ms
FROM TABLE(RAW.INFORMATION_SCHEMA.QUERY_HISTORY_BY_SESSION())
WHERE query_tag <> '' AND query_type = 'SELECT'
  AND query_text ILIKE 'SELECT l_returnflag%'
ORDER BY start_time;
