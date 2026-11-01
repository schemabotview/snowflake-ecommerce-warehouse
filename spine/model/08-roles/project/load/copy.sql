-- Stage to table, file by file; each file's name kept on its rows.
COPY INTO ORDERS FROM (
  SELECT $1, $2, $3, $4, $5, $6, METADATA$FILENAME, CURRENT_TIMESTAMP()
  FROM @LANDING/orders/) FILE_FORMAT = (FORMAT_NAME = FF_CSV)
  ->> SELECT 'ORDERS' AS tbl, COUNT(*) AS files,
             SUM("rows_loaded") AS row_count FROM $1;
COPY INTO ORDER_ITEMS FROM (
  SELECT $1, $2, $3, $4, $5, METADATA$FILENAME, CURRENT_TIMESTAMP()
  FROM @LANDING/order_items/) FILE_FORMAT = (FORMAT_NAME = FF_CSV)
  ->> SELECT 'ORDER_ITEMS' AS tbl, COUNT(*) AS files,
             SUM("rows_loaded") AS row_count FROM $1;
COPY INTO CUSTOMERS FROM (
  SELECT $1, $2, $3, $4, METADATA$FILENAME, CURRENT_TIMESTAMP()
  FROM @LANDING/customers.csv) FILE_FORMAT = (FORMAT_NAME = FF_CSV)
  ->> SELECT 'CUSTOMERS' AS tbl, COUNT(*) AS files,
             SUM("rows_loaded") AS row_count FROM $1;
COPY INTO FX_RATES FROM (
  SELECT $1, $2, $3, METADATA$FILENAME, CURRENT_TIMESTAMP()
  FROM @LANDING/fx_rates.csv) FILE_FORMAT = (FORMAT_NAME = FF_CSV)
  ->> SELECT 'FX_RATES' AS tbl, COUNT(*) AS files,
             SUM("rows_loaded") AS row_count FROM $1;
