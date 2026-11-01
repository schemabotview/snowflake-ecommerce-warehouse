-- One row per payment, in its own currency AND in euros, at that day's rate.
select
    p.payment_id,
    p.order_id,
    to_number(to_char(p.paid_ts, 'YYYYMMDD')) as paid_date_key,
    c.currency_key,
    p.amount,
    case when p.currency = 'EUR' then p.amount
         else round(p.amount / fx.per_eur, 2) end as amount_eur
from {{ ref('stg_payments') }} as p
join {{ ref('dim_currency') }} as c on c.code = p.currency
left join {{ ref('stg_fx') }} as fx
    on fx.currency = p.currency and fx.rate_date = p.paid_ts::date
