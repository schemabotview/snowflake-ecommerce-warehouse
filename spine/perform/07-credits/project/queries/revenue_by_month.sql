-- Course 1's question, asked of the star: revenue by category by month.
SELECT *
FROM (
    SELECT d.month, p.category, f.amount_eur
    FROM FCT_ORDER_LINES AS f
    JOIN DIM_DATE AS d ON d.date_key = f.order_date_key
    JOIN DIM_PRODUCT AS p ON p.product_key = f.product_key
    WHERE f.order_status = 'paid'
)
PIVOT (SUM(amount_eur) FOR category IN
       ('electronics', 'home', 'fashion', 'beauty', 'sports', 'books'))
ORDER BY month;
