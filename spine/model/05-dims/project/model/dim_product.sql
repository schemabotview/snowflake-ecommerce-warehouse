-- One row per product: what it is, how the business groups it.
CREATE OR REPLACE TABLE DIM_PRODUCT AS
SELECT product_id, sku, name, brand, category, price AS list_price
FROM RAW.SHOPWAVE.PRODUCTS;
