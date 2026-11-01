-- One row per product, keyed by the warehouse.
select
    md5(to_varchar(product_id)) as product_key,
    product_id,
    sku,
    product_name,
    brand,
    category,
    list_price_eur
from {{ ref('stg_products') }}
