-- A PERIODIC snapshot: one row per customer per month, whether or not they
-- ordered, with their tier as it stood at the month's end.
with months as (
    select distinct month, last_day(date) as month_end
    from {{ ref('dim_date') }}
),
orders as (
    select to_char(placed_at, 'YYYY-MM') as month, o.customer_id,
           count(*) as orders
    from {{ ref('fct_order_lifecycle') }} as l
    join {{ ref('stg_orders') }} as o on o.order_id = l.order_id
    where l.order_status = 'paid'
    group by 1, 2
)
select
    m.month,
    c.customer_id,
    coalesce(o.orders, 0) as orders,
    s.loyalty_tier as tier_at_month_end
from months as m
cross join {{ ref('stg_customers') }} as c
left join orders as o on o.month = m.month and o.customer_id = c.customer_id
left join {{ ref('snap_customers') }} as s
    on s.customer_id = c.customer_id
    and m.month_end >= s.dbt_valid_from::date
    and m.month_end < coalesce(s.dbt_valid_to, '9999-12-31')::date
