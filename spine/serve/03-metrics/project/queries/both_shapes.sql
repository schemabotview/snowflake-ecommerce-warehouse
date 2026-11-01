-- One query across both shapes: the device moved, the question did not.
SELECT DATE_TRUNC('month', V:event_ts::timestamp)::date AS month,
       COUNT(V:context.device) AS old_device,
       COUNT(V:context.device_type) AS new_device_type,
       COUNT(COALESCE(V:context.device_type, V:context.device)) AS device,
       COUNT(V:consent) AS consent
FROM CLICKS
WHERE V:event_ts::timestamp BETWEEN '2026-05-01' AND '2026-06-30 23:59:59'
GROUP BY 1 ORDER BY 1;
