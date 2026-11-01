-- The year's funnel: each step, and how many of the step before reached it.
SELECT SUM(sessions) AS sessions, SUM(viewed) AS viewed,
       SUM(carted) AS carted, SUM(checked_out) AS checked_out,
       SUM(purchased) AS purchased,
       ROUND(100 * SUM(purchased) / SUM(sessions), 1) AS conversion_pct
FROM FCT_FUNNEL;
-- A funnel only narrows: every purchase follows a checkout. The visits
-- that bought without one:
SELECT started_at, events, checked_out, purchased
FROM FCT_SESSIONS WHERE purchased AND NOT checked_out ORDER BY 1;
