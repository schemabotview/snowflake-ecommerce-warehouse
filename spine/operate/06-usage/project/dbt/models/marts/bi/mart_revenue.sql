-- The revenue mart: what the dashboard reads. One row per day and
-- category; paid orders only, in EUR.
select
    d.date,
    p.category,
    count(distinct f.order_id) as orders,
    sum(f.amount_eur) as revenue_eur,
    round(sum(f.amount_eur) / count(distinct f.order_id), 2) as aov_eur
from {{ ref('fct_order_lines') }} as f
join {{ ref('dim_date') }} as d on d.date_key = f.order_date_key
join {{ ref('dim_product') }} as p on p.product_key = f.product_key
where f.order_status = 'paid'
group by 1, 2
