-- One row per price a product has had.
select product_id, price as price_eur, valid_from
from {{ source('shopwave', 'product_prices') }}
