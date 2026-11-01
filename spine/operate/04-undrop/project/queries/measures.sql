-- Which sums are allowed? Three kinds of measure, three answers.
-- Additive: revenue adds up across any grouping.
-- Non-additive: AOV is a ratio. An average of AOVs is NOT the AOV.
WITH per_customer AS (
    SELECT customer_key, SUM(amount_eur) AS revenue,
           COUNT(DISTINCT order_id) AS orders
    FROM FCT_ORDER_LINES WHERE order_status = 'paid' GROUP BY 1
)
SELECT SUM(orders) AS orders,
       ROUND(SUM(revenue) / SUM(orders), 2) AS aov_right,
       ROUND(AVG(revenue / orders), 2) AS aov_averaged_wrong
FROM per_customer;
-- Semi-additive: gold customers at month end add across customers,
-- never across months.
SELECT SUM(IFF(tier_at_month_end = 'gold', 1, 0)) AS gold_summed_wrong,
       COUNT_IF(tier_at_month_end = 'gold' AND month = '2026-12')
         AS gold_at_year_end
FROM FCT_CUSTOMER_MONTHLY;
