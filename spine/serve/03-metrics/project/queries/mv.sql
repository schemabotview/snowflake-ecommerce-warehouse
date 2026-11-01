-- A materialised view: daily revenue, kept current by Snowflake itself.
CREATE OR REPLACE MATERIALIZED VIEW MV_DAILY_REVENUE AS
SELECT order_date_key, SUM(amount_eur) AS revenue_eur, COUNT(*) AS lines
FROM FCT_ORDER_LINES WHERE order_status = 'paid'
GROUP BY order_date_key;
ALTER SESSION SET USE_CACHED_RESULT = FALSE;
-- November's revenue twice: from the order lines, then from the view.
SELECT SUM(amount_eur) AS november_eur FROM FCT_ORDER_LINES
WHERE order_status = 'paid'
  AND order_date_key BETWEEN 20261101 AND 20261130;
SELECT operator_type AS operator,
       operator_statistics:output_rows::int AS rows_out
FROM TABLE(GET_QUERY_OPERATOR_STATS(LAST_QUERY_ID())) ORDER BY operator_id;
SELECT SUM(revenue_eur) AS november_eur FROM MV_DAILY_REVENUE
WHERE order_date_key BETWEEN 20261101 AND 20261130;
SELECT operator_type AS operator,
       operator_statistics:output_rows::int AS rows_out
FROM TABLE(GET_QUERY_OPERATOR_STATS(LAST_QUERY_ID())) ORDER BY operator_id;
-- Search optimisation on order ids: what it WOULD cost, before paying.
SELECT f.value:name::string AS cost,
       f.value:costs:value::number(10, 4) AS value,
       f.value:costs:unit::string AS unit
FROM TABLE(FLATTEN(PARSE_JSON(SYSTEM$ESTIMATE_SEARCH_OPTIMIZATION_COSTS(
    'FCT_ORDER_LINES', 'EQUALITY(order_id)')):costPositions)) AS f;
-- The view keeps costing credits to maintain: this one was a measurement.
DROP MATERIALIZED VIEW MV_DAILY_REVENUE;
