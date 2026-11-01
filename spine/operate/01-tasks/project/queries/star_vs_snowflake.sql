-- The same answer from a star and from a snowflaked product dimension.
CREATE OR REPLACE TEMPORARY TABLE DIM_CATEGORY AS
SELECT MD5(category) AS category_key, category
FROM (SELECT DISTINCT category FROM DIM_PRODUCT);
CREATE OR REPLACE TEMPORARY TABLE DIM_PRODUCT_SF AS
SELECT p.product_key, p.name, p.brand, c.category_key
FROM DIM_PRODUCT AS p JOIN DIM_CATEGORY AS c ON c.category = p.category;

SELECT 'star: 1 join' AS model, COUNT(DISTINCT p.category) AS categories,
       SUM(f.amount_eur) AS eur
FROM FCT_ORDER_LINES AS f
JOIN DIM_PRODUCT AS p ON p.product_key = f.product_key
UNION ALL
SELECT 'snowflake: 2 joins', COUNT(DISTINCT c.category), SUM(f.amount_eur)
FROM FCT_ORDER_LINES AS f
JOIN DIM_PRODUCT_SF AS p ON p.product_key = f.product_key
JOIN DIM_CATEGORY AS c ON c.category_key = p.category_key;
