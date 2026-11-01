-- The first table: the shop's products, exported and loaded as they are.
USE WAREHOUSE WH_LOAD;
USE SCHEMA RAW.SHOPWAVE;
CREATE OR REPLACE TABLE PRODUCTS (
    PRODUCT_ID  NUMBER(38, 0) NOT NULL,
    SKU         VARCHAR NOT NULL,
    NAME        VARCHAR NOT NULL,
    BRAND       VARCHAR NOT NULL,
    CATEGORY    VARCHAR NOT NULL,
    PRICE       NUMBER(10, 2) NOT NULL
);
-- Every table has its own stage, @%PRODUCTS (Course 5 builds a real one).
PUT file://exports/products.csv @%PRODUCTS OVERWRITE = TRUE;
COPY INTO PRODUCTS FROM @%PRODUCTS
  FILE_FORMAT = (TYPE = CSV SKIP_HEADER = 1)
  ->> SELECT "file", "status", "rows_loaded" FROM $1;
