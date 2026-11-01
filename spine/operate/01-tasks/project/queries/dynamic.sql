-- The same daily revenue, kept fresh by Snowflake instead of by dbt runs.
CREATE OR REPLACE DYNAMIC TABLE DT_DAILY_REVENUE
  TARGET_LAG = '1 hour'
  WAREHOUSE = WH_TRANSFORM
AS
SELECT d.date, SUM(f.amount_eur) AS revenue_eur
FROM FCT_ORDER_LINES AS f
JOIN DIM_DATE AS d ON d.date_key = f.order_date_key
WHERE f.order_status = 'paid'
GROUP BY d.date;
SHOW DYNAMIC TABLES LIKE 'DT_DAILY_REVENUE'
  ->> SELECT "name", "target_lag", "refresh_mode", "scheduling_state"
      FROM $1;
-- A demonstration: stop it refreshing, and spending.
ALTER DYNAMIC TABLE DT_DAILY_REVENUE SUSPEND;
