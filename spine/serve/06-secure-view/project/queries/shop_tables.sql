-- Shopwave's shop database: its four tables.
SELECT 'orders' AS table_name, count(*) AS rows,
       pg_size_pretty(pg_total_relation_size('orders')) AS size
FROM orders
UNION ALL
SELECT 'order_items', count(*),
       pg_size_pretty(pg_total_relation_size('order_items'))
FROM order_items
UNION ALL
SELECT 'customers', count(*),
       pg_size_pretty(pg_total_relation_size('customers'))
FROM customers
UNION ALL
SELECT 'products', count(*),
       pg_size_pretty(pg_total_relation_size('products'))
FROM products;
