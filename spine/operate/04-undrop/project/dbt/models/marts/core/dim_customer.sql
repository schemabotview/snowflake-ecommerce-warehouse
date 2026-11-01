-- One row per VERSION of a customer, from the snapshot.
-- dbt replaces the table on every run, and a policy is attached to the
-- table: so the model attaches them again, every time, after it builds.
{{ config(post_hook=[
    "alter table {{ this }} modify column email
     set masking policy analytics.marts.pii_email",
    "alter table {{ this }} add row access policy
     analytics.marts.by_region on (country)"]) }}
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
