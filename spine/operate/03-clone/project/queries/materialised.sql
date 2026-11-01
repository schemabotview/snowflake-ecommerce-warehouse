-- What dbt built, as Snowflake sees it.
SELECT table_schema, table_name, table_type
FROM ANALYTICS.INFORMATION_SCHEMA.TABLES
WHERE table_schema IN ('STAGING', 'MARTS')
ORDER BY 1, 2;
