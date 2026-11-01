-- The shop's price log: every price each product has had, from when.
CREATE TABLE IF NOT EXISTS PRODUCT_PRICES (
  PRODUCT_ID NUMBER, PRICE NUMBER(10, 2), VALID_FROM DATE);
COPY INTO PRODUCT_PRICES FROM @LANDING/product_prices.csv
  FILE_FORMAT = (FORMAT_NAME = FF_CSV);
