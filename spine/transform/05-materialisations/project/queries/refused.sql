-- An analyst tries to fix a product's price, in RAW.
USE WAREHOUSE WH_BI;
UPDATE RAW.SHOPWAVE.PRODUCTS SET PRICE = 59.00 WHERE PRODUCT_ID = 1;
