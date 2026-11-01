-- One table, two readers: customers by country. The analytics team:
SELECT country, COUNT(DISTINCT customer_id) AS customers
FROM DIM_CUSTOMER GROUP BY 1 ORDER BY 2 DESC LIMIT 4;
-- The country manager for Germany and Austria:
USE ROLE REGION_MANAGER;
USE SECONDARY ROLES NONE;
USE WAREHOUSE WH_BI;
SELECT country, COUNT(DISTINCT customer_id) AS customers
FROM DIM_CUSTOMER GROUP BY 1 ORDER BY 2 DESC LIMIT 4;
