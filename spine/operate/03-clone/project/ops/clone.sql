-- A copy of the whole warehouse to work on, in one statement.
CREATE OR REPLACE DATABASE ANALYTICS_DEV CLONE ANALYTICS;
-- Same rows in both...
SELECT 'ANALYTICS' AS db, COUNT(*) AS order_lines
FROM ANALYTICS.MARTS.FCT_ORDER_LINES
UNION ALL
SELECT 'ANALYTICS_DEV', COUNT(*) FROM ANALYTICS_DEV.MARTS.FCT_ORDER_LINES;
-- ...but one set of micro-partitions: the clone owns no bytes yet.
SELECT table_catalog AS db, active_bytes, clone_group_id = id AS original
FROM ANALYTICS.INFORMATION_SCHEMA.TABLE_STORAGE_METRICS
WHERE table_name = 'FCT_ORDER_LINES' AND table_schema = 'MARTS'
  AND COALESCE(catalog_dropped, schema_dropped, table_dropped) IS NULL
  AND table_catalog IN ('ANALYTICS', 'ANALYTICS_DEV') ORDER BY 1;
-- Change one order in the copy: only the partition it is in is rewritten.
UPDATE ANALYTICS_DEV.MARTS.FCT_ORDER_LINES SET qty = qty
WHERE order_id = 18000;
SELECT 'ANALYTICS' AS db, SUM(qty) AS order_18000_qty
FROM ANALYTICS.MARTS.FCT_ORDER_LINES WHERE order_id = 18000
UNION ALL
SELECT 'ANALYTICS_DEV', SUM(qty)
FROM ANALYTICS_DEV.MARTS.FCT_ORDER_LINES WHERE order_id = 18000;
-- The copy now owns the bytes it changed, and only those:
SELECT table_catalog AS db, active_bytes, clone_group_id = id AS original
FROM ANALYTICS.INFORMATION_SCHEMA.TABLE_STORAGE_METRICS
WHERE table_name = 'FCT_ORDER_LINES' AND table_schema = 'MARTS'
  AND COALESCE(catalog_dropped, schema_dropped, table_dropped) IS NULL
  AND table_catalog IN ('ANALYTICS', 'ANALYTICS_DEV') ORDER BY 1;
