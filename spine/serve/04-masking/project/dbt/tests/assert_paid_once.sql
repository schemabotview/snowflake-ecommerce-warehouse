-- No order is paid twice. Rows returned = failures.
select order_id, count(*) as payments
from {{ ref('stg_payments') }}
group by order_id
having count(*) > 1
