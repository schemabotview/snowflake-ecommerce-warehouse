-- Compute for loading: the smallest size, asleep unless used.
CREATE WAREHOUSE IF NOT EXISTS WH_LOAD
  WAREHOUSE_SIZE = XSMALL
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE
  INITIALLY_SUSPENDED = TRUE
  COMMENT = 'Shopwave: loading raw data';
