-- One row per VERSION of a product: a new one at every price change.
-- The source keeps its own history, so no snapshot is needed.
select
    md5(p.product_id || '-' || v.valid_from) as product_key,
    p.product_id,
    p.sku,
    p.product_name,
    p.brand,
    p.category,
    v.price_eur as list_price_eur,
    v.valid_from,
    coalesce(lead(v.valid_from) over (
        partition by p.product_id order by v.valid_from),
        '9999-12-31'::date) as valid_to
from {{ ref('stg_products') }} as p
join {{ ref('stg_product_prices') }} as v on v.product_id = p.product_id
