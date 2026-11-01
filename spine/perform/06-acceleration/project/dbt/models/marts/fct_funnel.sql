-- The checkout funnel by day: how many visits reached each step.
select
    date_key,
    count(*) as sessions,
    count_if(viewed) as viewed,
    count_if(carted) as carted,
    count_if(checked_out) as checked_out,
    count_if(purchased) as purchased
from {{ ref('fct_sessions') }}
group by date_key
