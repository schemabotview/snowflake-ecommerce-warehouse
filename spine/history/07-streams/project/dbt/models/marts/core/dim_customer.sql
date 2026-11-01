-- One row per VERSION of a customer, from the snapshot.
select
    md5(customer_id || '-' || dbt_valid_from) as customer_key,
    customer_id,
    country,
    loyalty_tier,
    case country when 'GB' then 'GBP' when 'US' then 'USD'
                 when 'IN' then 'INR' else 'EUR' end as home_currency,
    signup_date,
    email,
    dbt_valid_from as valid_from,
    coalesce(dbt_valid_to, '9999-12-31'::timestamp_ntz) as valid_to
from {{ ref('snap_customers') }}
