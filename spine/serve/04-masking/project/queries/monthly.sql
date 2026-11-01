-- One row per customer per month: customer 81's year.
SELECT COUNT(*) AS rows_in_table FROM FCT_CUSTOMER_MONTHLY;
SELECT month, orders, tier_at_month_end AS tier
FROM FCT_CUSTOMER_MONTHLY WHERE customer_id = 81 ORDER BY month LIMIT 6;
