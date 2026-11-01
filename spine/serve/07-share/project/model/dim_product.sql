-- One row per product: what it is, how the business groups it.
CREATE OR REPLACE TABLE DIM_PRODUCT AS
SELECT MD5(TO_VARCHAR(product_id)) AS product_key,
       product_id, sku, name, brand, category, price AS list_price
FROM RAW.SHOPWAVE.PRODUCTS;
