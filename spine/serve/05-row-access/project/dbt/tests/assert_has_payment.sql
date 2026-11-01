-- An order the shop marks paid must have a payment. Rows returned = failures.
select o.order_id, o.order_status
from {{ ref('stg_orders') }} as o
left join {{ ref('stg_payments') }} as p on p.order_id = o.order_id
where o.order_status = 'paid' and p.order_id is null
