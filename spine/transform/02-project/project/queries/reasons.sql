-- The returns' reasons, read correctly.
SELECT REASON, COUNT(*) AS returns
FROM RETURNS GROUP BY 1 ORDER BY 2 DESC;
