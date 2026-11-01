-- How the order lines are laid out: partitions, and how they overlap.
SELECT j:total_partition_count::int AS partitions,
       j:average_overlaps::number(6, 2) AS overlaps,
       j:average_depth::number(6, 2) AS depth
FROM (SELECT PARSE_JSON(SYSTEM$CLUSTERING_INFORMATION(
        'FCT_ORDER_LINES', '(order_date_key)')) AS j);
-- A month of orders: how many partitions did Snowflake have to read?
ALTER SESSION SET USE_CACHED_RESULT = FALSE;
SELECT SUM(amount_eur) AS november_eur FROM FCT_ORDER_LINES
WHERE order_date_key BETWEEN 20261101 AND 20261130;
SELECT operator_statistics:pruning:partitions_scanned::int AS scanned,
       operator_statistics:pruning:partitions_total::int AS total
FROM TABLE(GET_QUERY_OPERATOR_STATS(LAST_QUERY_ID()))
WHERE operator_type = 'TableScan';
