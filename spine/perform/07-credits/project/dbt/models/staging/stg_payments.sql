-- One row per payment: an order paid twice has two.
select payment_id, order_id, paid_ts, currency, amount, method
from {{ source('shopwave', 'payments') }}
