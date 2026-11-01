-- One row per currency per day: how many of it buy one euro.
select date as rate_date, currency, per_eur
from {{ source('shopwave', 'fx_rates') }}
