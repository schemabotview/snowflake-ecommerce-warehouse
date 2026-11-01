-- One order, three ways to count it. Order 2293 was paid twice.
SELECT 'one row per order' AS grain, COUNT(*) AS row_count, SUM(total) AS eur
FROM RAW.SHOPWAVE.ORDERS WHERE order_id = 2293
UNION ALL
SELECT 'one row per order line', COUNT(*), SUM(qty * unit_price)
FROM RAW.SHOPWAVE.ORDER_ITEMS WHERE order_id = 2293
UNION ALL
SELECT 'order lines x payments', COUNT(*), SUM(i.qty * i.unit_price)
FROM RAW.SHOPWAVE.ORDER_ITEMS AS i
JOIN RAW.SHOPWAVE.PAYMENTS AS p ON p.order_id = i.order_id
WHERE i.order_id = 2293;
