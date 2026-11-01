-- How far orders have got, milestone by milestone.
SELECT COUNT(*) AS orders, COUNT(paid_at) AS paid,
       COUNT(shipped_at) AS shipped, COUNT(delivered_at) AS delivered,
       COUNT(returned_on) AS returned,
       ROUND(AVG(days_to_deliver), 1) AS avg_days_to_deliver
FROM FCT_ORDER_LIFECYCLE;
SELECT order_id, placed_at::date AS placed, paid_at::date AS paid,
       shipped_at::date AS shipped, delivered_at::date AS delivered
FROM FCT_ORDER_LIFECYCLE WHERE order_id IN (18000, 20020) ORDER BY 1;
