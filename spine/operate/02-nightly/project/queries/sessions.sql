-- Clicks become visits; the bot's clicks become nothing.
SELECT (SELECT COUNT(*) FROM ANALYTICS.STAGING.STG_CLICKS) AS clicks,
       (SELECT COUNT(*) FROM ANALYTICS.STAGING.STG_CLICKS
        WHERE anon_id = 'anon-bot-7f3a') AS bot_clicks,
       COUNT(*) AS sessions, ROUND(AVG(events), 1) AS events_per_session
FROM FCT_SESSIONS;
