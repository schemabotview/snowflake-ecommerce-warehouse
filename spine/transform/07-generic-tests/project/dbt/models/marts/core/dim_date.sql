-- One row per day of 2026: made, not loaded.
select
    to_number(to_char(d, 'YYYYMMDD')) as date_key,
    d as date,
    dayname(d) as day_name,
    dayofweekiso(d) >= 6 as is_weekend,
    to_char(d, 'YYYY-MM') as month,
    'Q' || quarter(d) as quarter,
    year(d) as year,
    d = '2026-11-27' as is_black_friday
from (
    select dateadd(day, seq4(), '2026-01-01'::date) as d
    from table(generator(rowcount => 365))
)
