-- Where the warehouse's time went in that run, model by model.
SELECT query_tag AS model, COUNT(*) AS queries,
       ROUND(SUM(execution_time) / 1000, 1) AS seconds,
       ROUND(100 * RATIO_TO_REPORT(SUM(execution_time)) OVER (), 1) AS pct
FROM TABLE(ANALYTICS.INFORMATION_SCHEMA.QUERY_HISTORY_BY_WAREHOUSE(
    WAREHOUSE_NAME => 'WH_TRANSFORM', RESULT_LIMIT => 1000))
WHERE start_time > DATEADD(minute, -10, CURRENT_TIMESTAMP())
  AND query_tag LIKE ANY ('fct%', 'dim%', 'stg%', 'int%')
GROUP BY 1 ORDER BY 3 DESC LIMIT 6;
