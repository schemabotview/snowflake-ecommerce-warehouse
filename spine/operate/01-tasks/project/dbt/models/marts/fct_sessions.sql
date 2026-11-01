-- One row per visit: a visitor's clicks with no gap of 30 minutes or more.
-- The scraper (one anonymous id, 8% of page views) is not a visitor.
{% set bot = 'anon-bot-7f3a' %}
with clicks as (
    select *,
           coalesce(to_varchar(customer_id), anon_id) as visitor,
           datediff(minute, lag(event_ts) over (
               partition by coalesce(to_varchar(customer_id), anon_id)
               order by event_ts), event_ts) as gap_minutes
    from {{ ref('stg_clicks') }}
    where coalesce(anon_id, '') <> '{{ bot }}'
),
numbered as (
    select *,
           sum(iff(gap_minutes is null or gap_minutes >= 30, 1, 0)) over (
               partition by visitor order by event_ts
               rows unbounded preceding) as session_number
    from clicks
)
select
    visitor || '-' || session_number as session_id,
    any_value(customer_id) as customer_id,
    to_number(to_char(min(event_ts), 'YYYYMMDD')) as date_key,
    min(event_ts) as started_at,
    max(event_ts) as ended_at,
    count(*) as events,
    max(campaign) as campaign,
    max(device) as device,
    boolor_agg(event_type = 'product_view') as viewed,
    boolor_agg(event_type = 'add_to_cart') as carted,
    boolor_agg(event_type = 'checkout') as checked_out,
    boolor_agg(event_type = 'purchase') as purchased
from numbered
group by visitor, session_number
