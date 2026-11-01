-- An order's first payment. Ephemeral: inlined where it is used,
-- never built in Snowflake.
{{ config(materialized='ephemeral') }}
select order_id, min(paid_ts) as paid_ts
from {{ ref('stg_payments') }}
group by order_id
