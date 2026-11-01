-- One row per product.
select
    product_id,
    sku,
    name as product_name,
    brand,
    category,
    price as list_price_eur
from {{ source('shopwave', 'products') }}
