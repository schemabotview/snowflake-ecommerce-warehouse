-- The rest of the year's change feed (December 1-7 came in Course 8):
-- load metadata skips the files already loaded.
COPY INTO ORDER_CHANGES FROM (
  SELECT $1:op, $1:order_id, $1:status, $1:changed_at
  FROM @LANDING/order_changes/) FILE_FORMAT = (FORMAT_NAME = FF_JSON)
  ->> SELECT COUNT(*) AS files, SUM("rows_loaded") AS row_count FROM $1;
