-- The dashboard's query: November's revenue by day and category.
ALTER SESSION SET USE_CACHED_RESULT = FALSE;
SELECT d.date, p.category, SUM(f.amount_eur) AS revenue_eur
FROM FCT_ORDER_LINES AS f
JOIN DIM_DATE AS d ON d.date_key = f.order_date_key
JOIN DIM_PRODUCT AS p ON p.product_key = f.product_key
WHERE d.date BETWEEN '2026-11-01' AND '2026-11-30'
  AND f.order_status = 'paid'
GROUP BY 1, 2 ORDER BY 1, 2 LIMIT 4;
-- How Snowflake ran it, operator by operator: the query profile as rows.
SELECT operator_id AS id, operator_type AS operator,
       parent_operators[0]::int AS parent,
       operator_statistics:output_rows::int AS rows_out,
       ROUND(100 * execution_time_breakdown:overall_percentage, 1) AS pct
FROM TABLE(GET_QUERY_OPERATOR_STATS(LAST_QUERY_ID()))
ORDER BY operator_id;
