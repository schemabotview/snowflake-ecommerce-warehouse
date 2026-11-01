-- ONE definition of revenue for every report: paid orders, in EUR, net of
-- what was refunded on them. The month is the month the order was placed.
with sales as (
    select to_char(order_ts, 'YYYY-MM') as month,
           count(distinct order_id) as orders, sum(amount_eur) as gross_eur
    from {{ ref('fct_order_lines') }}
    where order_status = 'paid'
    group by 1
),
refunds as (
    select to_char(f.order_ts, 'YYYY-MM') as month,
           sum(r.refund_eur) as refunds_eur
    from {{ ref('fct_returns') }} as r
    join {{ ref('fct_order_lines') }} as f
        on f.order_line_key = r.order_line_key
    where f.order_status = 'paid'
    group by 1
)
select
    s.month,
    s.orders,
    s.gross_eur,
    coalesce(r.refunds_eur, 0) as refunds_eur,
    s.gross_eur - coalesce(r.refunds_eur, 0) as net_revenue_eur,
    round((s.gross_eur - coalesce(r.refunds_eur, 0)) / s.orders, 2) as aov_eur
from sales as s
left join refunds as r on r.month = s.month
