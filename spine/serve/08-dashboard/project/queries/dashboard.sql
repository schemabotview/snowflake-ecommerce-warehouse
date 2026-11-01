-- The dashboard's first tile, as an analyst reads it: Black Friday's
-- revenue by category, from the mart.
USE ROLE ANALYST;
USE SECONDARY ROLES NONE;
USE WAREHOUSE WH_BI;
SELECT category, revenue_eur, orders, aov_eur
FROM BI.MART_REVENUE WHERE date = '2026-11-27' ORDER BY 2 DESC;
SELECT SUM(revenue_eur) AS black_friday_eur
FROM BI.MART_REVENUE WHERE date = '2026-11-27';
