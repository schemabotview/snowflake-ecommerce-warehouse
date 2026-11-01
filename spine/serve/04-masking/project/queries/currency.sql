-- Summing amounts in four currencies is meaningless; in euros it is not.
SELECT c.code, COUNT(*) AS payments, SUM(p.amount) AS amount,
       SUM(p.amount_eur) AS amount_eur
FROM ANALYTICS.MARTS.FCT_PAYMENTS AS p
JOIN ANALYTICS.MARTS.DIM_CURRENCY AS c ON c.currency_key = p.currency_key
GROUP BY ROLLUP (c.code) ORDER BY c.code NULLS LAST;
