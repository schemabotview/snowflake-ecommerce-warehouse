-- One column, two readers. First the analytics team:
SELECT DISTINCT customer_id, email FROM DIM_CUSTOMER WHERE customer_id = 81;
-- Then an analyst, with the analyst's role alone (Course 4):
USE ROLE ANALYST;
USE SECONDARY ROLES NONE;
USE WAREHOUSE WH_BI;
SELECT DISTINCT customer_id, email FROM DIM_CUSTOMER WHERE customer_id = 81;
