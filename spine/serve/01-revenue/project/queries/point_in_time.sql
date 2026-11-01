-- Customer 81's orders: where they lived THEN, and where they live now.
SELECT f.order_id, d.date AS ordered, c.country AS country_then,
       c.loyalty_tier AS tier_then, now.country AS country_now
FROM ANALYTICS.MARTS.FCT_ORDER_LINES AS f
JOIN ANALYTICS.MARTS.DIM_DATE AS d ON d.date_key = f.order_date_key
JOIN ANALYTICS.MARTS.DIM_CUSTOMER AS c ON c.customer_key = f.customer_key
JOIN ANALYTICS.MARTS.DIM_CUSTOMER AS now
  ON now.customer_id = c.customer_id AND now.valid_to = '9999-12-31'
WHERE c.customer_id = 81 AND f.line = 1
ORDER BY ordered LIMIT 6;
-- Every line's price equals its product version's list price that day.
SELECT COUNT(*) AS lines,
       COUNT_IF(f.unit_price = p.list_price_eur) AS priced_as_listed
FROM ANALYTICS.MARTS.FCT_ORDER_LINES AS f
JOIN ANALYTICS.MARTS.DIM_PRODUCT AS p ON p.product_key = f.product_key;
