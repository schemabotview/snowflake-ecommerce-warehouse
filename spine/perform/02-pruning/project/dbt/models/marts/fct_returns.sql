-- One row per returned line, joined to the order line it undoes.
with lines as (
    select f.order_line_key, f.order_id, f.line, f.product_key,
           f.customer_key, f.amount_eur, p.product_id
    from {{ ref('fct_order_lines') }} as f
    join {{ ref('dim_product') }} as p on p.product_key = f.product_key
)
select
    r.return_id,
    r.order_id,
    to_number(to_char(r.returned_on, 'YYYYMMDD')) as return_date_key,
    l.order_line_key,
    l.product_key,
    l.customer_key,
    r.reason,
    l.amount_eur as refund_eur
from {{ ref('stg_returns') }} as r
left join lines as l
    on l.order_id = r.order_id and l.product_id = r.product_id
qualify row_number() over (partition by r.return_id order by l.line) = 1
