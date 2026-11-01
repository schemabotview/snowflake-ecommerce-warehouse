-- What Brightline may see: its campaigns' visits and purchases by week.
-- SECURE: a reader gets the rows, never the definition or what is behind.
-- copy_grants: a rebuild keeps the view's grants (the share's included).
{{ config(materialized='view', secure=true, copy_grants=true) }}
with campaigns as (
    select distinct campaign_id, channel from {{ ref('fct_eligibility') }}
)
select
    s.campaign as campaign_id,
    c.channel,
    date_trunc(week, s.started_at)::date as week,
    count(*) as visits,
    count_if(s.purchased) as buying_visits
from {{ ref('fct_sessions') }} as s
join campaigns as c on c.campaign_id = s.campaign
group by 1, 2, 3
