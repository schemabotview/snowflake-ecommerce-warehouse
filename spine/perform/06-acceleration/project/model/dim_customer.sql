-- One row per customer: who bought, and where they live.
-- customer_key is the warehouse's own key (Course 8 gives it versions).
CREATE OR REPLACE TABLE DIM_CUSTOMER AS
SELECT
    MD5(TO_VARCHAR(customer_id))      AS customer_key,
    customer_id,                      -- the shop's natural key
    country,
    CASE WHEN country = 'GB' THEN 'GBP' WHEN country = 'US' THEN 'USD'
         WHEN country = 'IN' THEN 'INR' ELSE 'EUR' END AS home_currency,
    signup_date,
    email
FROM RAW.SHOPWAVE.CUSTOMERS;
