-- One row per status change the shop recorded: shipped, delivered.
select order_id, lower(status) as status, changed_at
from {{ source('shopwave', 'order_changes') }}
