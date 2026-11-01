-- The fact: one row per order line, pointing at its dimensions by key.
CREATE OR REPLACE TABLE FCT_ORDER_LINES AS
SELECT
    i.order_id,                          -- degenerate: no dimension
    i.line,
    TO_NUMBER(TO_CHAR(o.order_ts, 'YYYYMMDD')) AS order_date_key,
    TO_NUMBER(TO_CHAR(pay.paid_ts, 'YYYYMMDD')) AS paid_date_key,
    c.customer_key,
    p.product_key,
    o.status                AS order_status,
    i.qty,                                -- additive
    i.unit_price,                         -- not additive
    i.qty * i.unit_price    AS amount_eur -- additive
FROM RAW.SHOPWAVE.ORDER_ITEMS AS i
JOIN RAW.SHOPWAVE.ORDERS AS o ON o.order_id = i.order_id
JOIN DIM_CUSTOMER AS c ON c.customer_id = o.customer_id
JOIN DIM_PRODUCT AS p ON p.product_id = i.product_id
LEFT JOIN (   -- the first payment: an order paid twice is still one order
    SELECT order_id, MIN(paid_ts) AS paid_ts
    FROM RAW.SHOPWAVE.PAYMENTS GROUP BY order_id
) AS pay ON pay.order_id = i.order_id;
