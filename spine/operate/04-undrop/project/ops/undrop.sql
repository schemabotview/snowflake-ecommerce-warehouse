-- A mart dropped by mistake, and brought back.
SELECT COUNT(*) AS row_count FROM BI.MART_COHORTS;
DROP TABLE BI.MART_COHORTS;
SHOW TABLES HISTORY LIKE 'MART_COHORTS' IN SCHEMA ANALYTICS.BI
  ->> SELECT "name", "rows", "dropped_on" FROM $1;
UNDROP TABLE BI.MART_COHORTS;
SELECT COUNT(*) AS row_count FROM BI.MART_COHORTS;
-- Time travel: the same table as it was five minutes ago, and how far back
-- this account can look.
SELECT COUNT(*) AS rows_5_minutes_ago
FROM BI.MART_COHORTS AT(OFFSET => -300);
SHOW PARAMETERS LIKE 'DATA_RETENTION_TIME_IN_DAYS' IN DATABASE ANALYTICS
  ->> SELECT "key", "value", "level" FROM $1;
