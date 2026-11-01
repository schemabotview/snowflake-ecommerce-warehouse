-- Returns by reason, and how many found the line they undo.
SELECT reason, COUNT(*) AS returns, COUNT(order_line_key) AS matched,
       SUM(refund_eur) AS refund_eur
FROM FCT_RETURNS GROUP BY 1 ORDER BY 2 DESC;
