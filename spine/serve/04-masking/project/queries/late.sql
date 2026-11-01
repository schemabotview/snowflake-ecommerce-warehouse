-- When did each click HAPPEN, and on which day's file did it ARRIVE?
SELECT DATEDIFF(day, V:event_ts::date,
                SPLIT_PART(_file, '/', 2)::date) AS days_late,
       COUNT(*) AS events
FROM RAW.SHOPWAVE.CLICKS
GROUP BY 1 ORDER BY 1;
