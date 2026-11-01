-- Cohort retention: customers grouped by the month of their first paid
-- order, and how many of them ordered again in each month after it.
with orders as (
    select c.customer_id, to_char(f.order_ts, 'YYYY-MM') as month
    from {{ ref('fct_order_lines') }} as f
    join {{ ref('dim_customer') }} as c on c.customer_key = f.customer_key
    where f.order_status = 'paid'
    group by 1, 2
),
firsts as (
    select customer_id, min(month) as cohort from orders group by 1
),
sizes as (
    select cohort, count(*) as cohort_size from firsts group by 1
)
select
    f.cohort,
    datediff(month, to_date(f.cohort, 'YYYY-MM'),
             to_date(o.month, 'YYYY-MM')) as months_after,
    count(*) as customers,
    s.cohort_size,
    round(100 * count(*) / s.cohort_size, 1) as retention_pct
from orders as o
join firsts as f on f.customer_id = o.customer_id
join sizes as s on s.cohort = f.cohort
group by 1, 2, 4
