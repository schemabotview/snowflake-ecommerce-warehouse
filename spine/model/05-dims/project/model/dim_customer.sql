-- One row per customer: who bought, and where they live.
CREATE OR REPLACE TABLE DIM_CUSTOMER AS
SELECT
    customer_id,
    country,
    CASE WHEN country = 'GB' THEN 'GBP' WHEN country = 'US' THEN 'USD'
         WHEN country = 'IN' THEN 'INR' ELSE 'EUR' END AS home_currency,
    signup_date,
    email
FROM RAW.SHOPWAVE.CUSTOMERS;
