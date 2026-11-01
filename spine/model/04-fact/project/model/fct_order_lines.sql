-- The fact: one row per order line. Its grain, in one sentence.
CREATE OR REPLACE TABLE FCT_ORDER_LINES AS
SELECT
    i.order_id,                          -- degenerate: no dimension
    i.line,
    o.order_ts::date        AS order_date,
    o.customer_id,
    i.product_id,
    o.status                AS order_status,
    i.qty,                                -- additive
    i.unit_price,                         -- not additive
    i.qty * i.unit_price    AS amount_eur -- additive
FROM RAW.SHOPWAVE.ORDER_ITEMS AS i
JOIN RAW.SHOPWAVE.ORDERS AS o ON o.order_id = i.order_id;
