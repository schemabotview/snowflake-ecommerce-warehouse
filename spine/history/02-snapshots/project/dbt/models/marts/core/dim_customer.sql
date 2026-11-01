-- One row per customer, keyed by the warehouse.
select
    md5(to_varchar(customer_id)) as customer_key,
    customer_id,
    country,
    case country when 'GB' then 'GBP' when 'US' then 'USD'
                 when 'IN' then 'INR' else 'EUR' end as home_currency,
    signup_date,
    email
from {{ ref('stg_customers') }}
