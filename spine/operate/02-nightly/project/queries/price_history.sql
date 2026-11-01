-- Products whose price changed twice in 2026: their three versions.
SELECT product_id, product_name, list_price_eur, valid_from, valid_to
FROM ANALYTICS.MARTS.DIM_PRODUCT
QUALIFY COUNT(*) OVER (PARTITION BY product_id) = 3
ORDER BY product_id, valid_from
LIMIT 6;
