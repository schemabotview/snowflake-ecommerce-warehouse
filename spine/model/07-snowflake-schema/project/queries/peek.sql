-- Read a staged file before loading it: the format at work.
SELECT $1 AS order_id, $2 AS order_ts, $5 AS status, $6 AS total
FROM @LANDING/orders/orders-2026-11-27.csv (FILE_FORMAT => 'FF_CSV')
LIMIT 3;
