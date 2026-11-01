-- Does the grain hold? One row per (order_id, line), and no line lost.
SELECT COUNT(*) AS fact_rows,
       COUNT(DISTINCT order_id, line) AS order_lines,
       (SELECT COUNT(*) FROM RAW.SHOPWAVE.ORDER_ITEMS) AS raw_lines
FROM FCT_ORDER_LINES;
