-- What the account did, from SNOWFLAKE.ACCOUNT_USAGE: the administrator's
-- record of everything, kept for a year and up to a few hours behind.
USE ROLE ACCOUNTADMIN;
USE WAREHOUSE WH_TRANSFORM;
-- Credits by warehouse, Shopwave's three, since the trial opened.
SELECT warehouse_name AS warehouse, ROUND(SUM(credits_used), 2) AS credits
FROM SNOWFLAKE.ACCOUNT_USAGE.WAREHOUSE_METERING_HISTORY
WHERE warehouse_name IN ('WH_LOAD', 'WH_TRANSFORM', 'WH_BI')
GROUP BY 1 ORDER BY 2 DESC;
-- Tasks that failed, and why.
SELECT name, COUNT(*) AS failures,
       LEFT(REPLACE(MAX(error_message), '\n', ' '), 34) AS error
FROM SNOWFLAKE.ACCOUNT_USAGE.TASK_HISTORY
WHERE database_name = 'ANALYTICS' AND state = 'FAILED' GROUP BY 1;
-- Who signed in, and how: Ana and the two service users.
SELECT user_name AS who, first_authentication_factor AS how,
       COUNT_IF(is_success = 'YES') AS ok,
       COUNT_IF(is_success = 'NO') AS failed
FROM SNOWFLAKE.ACCOUNT_USAGE.LOGIN_HISTORY
WHERE user_name IN (CURRENT_USER(), 'SVC_LOADER', 'SVC_DBT')
GROUP BY 1, 2 ORDER BY 3 DESC;
