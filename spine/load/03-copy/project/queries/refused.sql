-- Ana, working as an analyst. First with every role she holds active…
USE WAREHOUSE WH_BI;
SELECT CURRENT_ROLE() AS role, CURRENT_SECONDARY_ROLES() AS secondary;
SELECT COUNT(*) AS products FROM RAW.SHOPWAVE.PRODUCTS;
-- …then with the analyst's role alone, as Ravi has it.
USE SECONDARY ROLES NONE;
UPDATE RAW.SHOPWAVE.PRODUCTS SET PRICE = 59.00 WHERE PRODUCT_ID = 1;
