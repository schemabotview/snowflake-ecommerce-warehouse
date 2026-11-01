-- One row per returned line.
select return_id, order_id, product_id, reason, returned_on
from {{ source('shopwave', 'returns') }}
