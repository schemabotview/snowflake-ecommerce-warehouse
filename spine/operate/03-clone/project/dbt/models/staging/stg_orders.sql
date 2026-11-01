-- One row per order: renamed and typed, nothing else.
select
    order_id,
    order_ts,
    customer_id,
    country as billing_country,
    lower(status) as order_status,
    total as total_eur
from {{ source('shopwave', 'orders') }}
