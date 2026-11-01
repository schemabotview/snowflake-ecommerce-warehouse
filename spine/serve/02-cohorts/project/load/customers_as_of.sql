-- CUSTOMER_STATE := the shop's customers as they stood at the end of a day.
TRUNCATE TABLE CUSTOMER_STATE;
INSERT INTO CUSTOMER_STATE
SELECT c.customer_id,
       COALESCE(x.country, c.country),
       COALESCE(x.loyalty_tier, 'bronze'),
       c.signup_date,
       c.email,
       COALESCE(x.changed_at, '2026-01-01'::timestamp_ntz)
FROM CUSTOMERS AS c
LEFT JOIN (
    SELECT * FROM CUSTOMER_CHANGES
    WHERE changed_at < DATEADD(day, 1, '<% day %>'::date)
    QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id
                               ORDER BY changed_at DESC) = 1
) AS x ON x.customer_id = c.customer_id;
