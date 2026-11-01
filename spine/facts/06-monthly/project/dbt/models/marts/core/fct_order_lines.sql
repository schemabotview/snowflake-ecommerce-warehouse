-- The fact: one row per order line. Incremental: after the first build,
-- only orders newer than the newest already in the table are merged in.
{{ config(materialized='incremental', unique_key='order_line_key',
          incremental_strategy='merge') }}
select
    i.order_id || '-' || i.line as order_line_key,
    i.order_id,
    i.line,
    to_number(to_char(o.order_ts, 'YYYYMMDD')) as order_date_key,
    to_number(to_char(p.paid_ts, 'YYYYMMDD')) as paid_date_key,
    c.customer_key,
    d.product_key,
    o.order_status,
    i.qty,
    i.unit_price_eur as unit_price,
    i.qty * i.unit_price_eur as amount_eur,
    o.order_ts
from {{ ref('stg_order_items') }} as i
join {{ ref('stg_orders') }} as o on o.order_id = i.order_id
-- point in time: the customer and the product as they were when ordered
join {{ ref('dim_customer') }} as c on c.customer_id = o.customer_id
    and o.order_ts >= c.valid_from and o.order_ts < c.valid_to
join {{ ref('dim_product') }} as d on d.product_id = i.product_id
    and o.order_ts::date >= d.valid_from and o.order_ts::date < d.valid_to
left join {{ ref('int_first_payment') }} as p on p.order_id = i.order_id
{% if is_incremental() %}
where o.order_ts > (select max(order_ts) from {{ this }})
{% endif %}
