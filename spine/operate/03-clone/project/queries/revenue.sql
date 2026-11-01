-- Black Friday week, from the mart: revenue per day.
SELECT date, SUM(revenue_eur) AS revenue_eur, COUNT(*) AS categories
FROM BI.MART_REVENUE
WHERE date BETWEEN '2026-11-23' AND '2026-11-29'
GROUP BY 1 ORDER BY 1;
