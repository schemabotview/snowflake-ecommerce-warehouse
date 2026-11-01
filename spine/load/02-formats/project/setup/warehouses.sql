-- Compute for loading: the smallest size, asleep unless used.
CREATE WAREHOUSE IF NOT EXISTS WH_LOAD
  WAREHOUSE_SIZE = XSMALL
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE
  INITIALLY_SUSPENDED = TRUE
  COMMENT = 'Shopwave: loading raw data';

-- Compute for BI: analysts query here, never on the loader's warehouse.
CREATE WAREHOUSE IF NOT EXISTS WH_BI
  WAREHOUSE_SIZE = XSMALL
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE
  INITIALLY_SUSPENDED = TRUE
  COMMENT = 'Shopwave: dashboards and analysts';
