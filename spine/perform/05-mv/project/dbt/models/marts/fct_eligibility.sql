-- A FACTLESS fact: one row per customer who could have used a campaign,
-- because they visited while it ran. No measure: the row is the fact.
with campaigns as (
    select campaign_id, channel, starts, ends
    from {{ source('shopwave', 'campaigns') }}
),
visits as (
    select distinct customer_id, started_at::date as day
    from {{ ref('fct_sessions') }}
    where customer_id is not null
)
select distinct
    c.campaign_id,
    c.channel,
    v.customer_id
from campaigns as c
join visits as v on v.day between c.starts and c.ends
