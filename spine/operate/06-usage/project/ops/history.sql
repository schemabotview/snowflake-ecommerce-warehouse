-- What each task did on its latest run.
SELECT name, state, LEFT(REPLACE(error_message, '\n', ' '), 34) AS error
FROM TABLE(INFORMATION_SCHEMA.TASK_HISTORY())
WHERE name IN ('NIGHTLY_SNAPSHOT', 'NIGHTLY_BUILD')
QUALIFY ROW_NUMBER() OVER (PARTITION BY name
                           ORDER BY scheduled_time DESC) = 1
ORDER BY scheduled_time;
-- What dbt said inside the build: its failures and its summary.
SET build = (SELECT query_id FROM TABLE(INFORMATION_SCHEMA.TASK_HISTORY(
  TASK_NAME => 'NIGHTLY_BUILD')) ORDER BY scheduled_time DESC LIMIT 1);
SELECT REGEXP_REPLACE(REGEXP_SUBSTR(f.value::string, ']: (.*)', 1, 1, 'e'),
                      ' [.]{3,}', '') AS dbt_said
FROM TABLE(FLATTEN(SPLIT(SYSTEM$GET_DBT_LOG($build), '\n'))) AS f
WHERE f.value::string LIKE ANY ('%FAIL %', '%Done.%');
