-- One DIM_DATE, two roles: when ordered, when paid.
SELECT od.date AS ordered, pd.date AS paid,
       COUNT(DISTINCT f.order_id) AS orders
FROM FCT_ORDER_LINES AS f
JOIN DIM_DATE AS od ON od.date_key = f.order_date_key
JOIN DIM_DATE AS pd ON pd.date_key = f.paid_date_key
WHERE od.date <> pd.date
GROUP BY 1, 2 ORDER BY 1 LIMIT 5;
SELECT COUNT(DISTINCT order_id) AS orders,
       COUNT(DISTINCT IFF(paid_date_key IS NULL, order_id, NULL)) AS unpaid
FROM FCT_ORDER_LINES;
