-- An ACCUMULATING snapshot: one row per order, its milestones filled in
-- as they happen. Rebuilt each run; a milestone not reached yet is NULL.
with changes as (
    select order_id,
           min(iff(status = 'shipped', changed_at, null)) as shipped_at,
           min(iff(status = 'delivered', changed_at, null)) as delivered_at
    from {{ ref('stg_order_changes') }}
    group by order_id
),
returned as (
    select order_id, min(returned_on) as returned_on
    from {{ ref('stg_returns') }}
    group by order_id
)
select
    o.order_id,
    to_number(to_char(o.order_ts, 'YYYYMMDD')) as order_date_key,
    o.order_status,
    o.order_ts as placed_at,
    p.paid_ts as paid_at,
    c.shipped_at,
    c.delivered_at,
    r.returned_on,
    datediff(day, o.order_ts, c.shipped_at) as days_to_ship,
    datediff(day, o.order_ts, c.delivered_at) as days_to_deliver
from {{ ref('stg_orders') }} as o
left join {{ ref('int_first_payment') }} as p on p.order_id = o.order_id
left join changes as c on c.order_id = o.order_id
left join returned as r on r.order_id = o.order_id
