-- Paths into the JSON: no schema was declared for any of it.
SELECT V:event_type::string AS event_type,
       V:context.device::string AS device,
       COUNT(*) AS events
FROM CLICKS
WHERE V:event_ts::timestamp < '2026-02-01'
GROUP BY 1, 2
ORDER BY 3 DESC
LIMIT 6;
