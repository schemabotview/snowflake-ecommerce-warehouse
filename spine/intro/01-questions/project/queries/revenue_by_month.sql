-- Revenue by category by month, in EUR, paid orders only.
SELECT to_char(o.order_ts AT TIME ZONE 'UTC', 'YYYY-MM') AS month,
       round(sum(i.qty * i.unit_price)
             FILTER (WHERE p.category = 'electronics')) AS electronics,
       round(sum(i.qty * i.unit_price)
             FILTER (WHERE p.category = 'home')) AS home,
       round(sum(i.qty * i.unit_price)
             FILTER (WHERE p.category = 'fashion')) AS fashion,
       round(sum(i.qty * i.unit_price)
             FILTER (WHERE p.category = 'beauty')) AS beauty,
       round(sum(i.qty * i.unit_price)
             FILTER (WHERE p.category = 'sports')) AS sports,
       round(sum(i.qty * i.unit_price)
             FILTER (WHERE p.category = 'books')) AS books
FROM order_items AS i
JOIN orders AS o ON o.order_id = i.order_id
JOIN products AS p ON p.product_id = i.product_id
WHERE o.status = 'paid'
GROUP BY month
ORDER BY month;
