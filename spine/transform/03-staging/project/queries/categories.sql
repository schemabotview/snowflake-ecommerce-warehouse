-- The first question asked of the warehouse.
USE WAREHOUSE WH_LOAD;
SELECT category, COUNT(*) AS products, ROUND(AVG(price), 2) AS avg_price
FROM RAW.SHOPWAVE.PRODUCTS
GROUP BY category
ORDER BY products DESC;
