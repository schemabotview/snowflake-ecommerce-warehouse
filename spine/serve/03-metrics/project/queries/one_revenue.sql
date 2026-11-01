-- November, three ways: two answers in use before, and the one metric.
SELECT 'every order line' AS answer, SUM(amount_eur) AS november_eur
FROM FCT_ORDER_LINES WHERE order_date_key BETWEEN 20261101 AND 20261130
UNION ALL
SELECT 'paid orders only', SUM(amount_eur) FROM FCT_ORDER_LINES
WHERE order_status = 'paid'
  AND order_date_key BETWEEN 20261101 AND 20261130
UNION ALL
SELECT 'paid, net of refunds', net_revenue_eur
FROM BI.METRICS_MONTHLY WHERE month = '2026-11'
ORDER BY 2 DESC;
-- The metric, month by month: what every report now reads.
SELECT month, orders, gross_eur, refunds_eur, net_revenue_eur, aov_eur
FROM BI.METRICS_MONTHLY WHERE month >= '2026-09' ORDER BY 1;
