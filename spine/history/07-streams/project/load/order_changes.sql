-- The shop's change feed: status changes, captured by a stream as they land.
CREATE TABLE IF NOT EXISTS ORDER_CHANGES (
  OP VARCHAR, ORDER_ID NUMBER, STATUS VARCHAR, CHANGED_AT TIMESTAMP_NTZ);
CREATE STREAM IF NOT EXISTS ORDER_CHANGES_STREAM ON TABLE ORDER_CHANGES;
COPY INTO ORDER_CHANGES FROM (
  SELECT $1:op, $1:order_id, $1:status, $1:changed_at
  FROM @LANDING/order_changes/) FILE_FORMAT = (FORMAT_NAME = FF_JSON)
  PATTERN = '.*changes-2026-12-0[1-7].jsonl'
  ->> SELECT COUNT(*) AS files, SUM("rows_loaded") AS rows FROM $1;
SELECT METADATA$ACTION AS action, status, COUNT(*) AS changes
FROM ORDER_CHANGES_STREAM GROUP BY 1, 2 ORDER BY 2;
-- Consume: a DML statement that reads the stream moves its offset on.
CREATE TABLE IF NOT EXISTS ORDER_STATUS (ORDER_ID NUMBER, STATUS VARCHAR,
                                          CHANGED_AT TIMESTAMP_NTZ);
INSERT INTO ORDER_STATUS SELECT order_id, status, changed_at
FROM ORDER_CHANGES_STREAM;
SELECT COUNT(*) AS left_in_stream FROM ORDER_CHANGES_STREAM;
