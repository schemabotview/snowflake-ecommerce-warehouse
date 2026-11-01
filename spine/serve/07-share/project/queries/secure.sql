-- An analyst reads the secure view: the rows...
USE ROLE ANALYST;
USE SECONDARY ROLES NONE;
USE WAREHOUSE WH_BI;
SELECT campaign_id, SUM(visits) AS visits, SUM(buying_visits) AS buying
FROM BI.CAMPAIGN_STATS GROUP BY 1 ORDER BY 2 DESC;
-- ...but not how it is made:
SHOW VIEWS LIKE 'CAMPAIGN_STATS' IN SCHEMA ANALYTICS.BI
  ->> SELECT "name", "is_secure", LEFT("text", 24) AS text FROM $1;
-- The owner sees the definition:
USE ROLE TRANSFORMER;
USE WAREHOUSE WH_TRANSFORM;
SHOW VIEWS LIKE 'CAMPAIGN_STATS' IN SCHEMA ANALYTICS.BI
  ->> SELECT "name", "is_secure", LEFT("text", 24) AS text FROM $1;
