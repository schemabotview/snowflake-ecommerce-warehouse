-- Customer 81's versions, as the snapshot recorded them.
SELECT customer_id, country, loyalty_tier,
       dbt_valid_from::date AS valid_from, dbt_valid_to::date AS valid_to
FROM ANALYTICS.STAGING.SNAP_CUSTOMERS
WHERE customer_id = 81
ORDER BY dbt_valid_from;
