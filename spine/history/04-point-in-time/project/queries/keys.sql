-- Every fact row finds its dimensions: no orphan keys.
SELECT COUNT(*) AS fact_rows,
       COUNT(d.date_key) AS with_date,
       COUNT(c.customer_key) AS with_customer,
       COUNT(p.product_key) AS with_product
FROM FCT_ORDER_LINES AS f
LEFT JOIN DIM_DATE AS d ON d.date_key = f.order_date_key
LEFT JOIN DIM_CUSTOMER AS c ON c.customer_key = f.customer_key
LEFT JOIN DIM_PRODUCT AS p ON p.product_key = f.product_key;
