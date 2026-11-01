-- One row per customer.
select customer_id, country, signup_date, email
from {{ source('shopwave', 'customers') }}
