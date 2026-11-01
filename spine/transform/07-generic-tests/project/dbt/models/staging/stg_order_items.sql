-- One row per order line.
select
    order_id,
    line,
    product_id,
    qty,
    unit_price as unit_price_eur
from {{ source('shopwave', 'order_items') }}
