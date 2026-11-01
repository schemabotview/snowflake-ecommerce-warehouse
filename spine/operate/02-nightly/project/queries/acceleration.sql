-- A big scan with little filtering: every click of the year, by campaign.
ALTER SESSION SET USE_CACHED_RESULT = FALSE;
SELECT v:context.campaign::string AS campaign, COUNT(*) AS clicks
FROM RAW.SHOPWAVE.CLICKS GROUP BY 1 ORDER BY 2 DESC;
-- Would the query acceleration service have helped this query?
SELECT j:status::string AS status,
       j:originalQueryTime::number(8, 3) AS seconds,
       j:upperLimitScaleFactor::int AS scale_factor
FROM (SELECT PARSE_JSON(SYSTEM$ESTIMATE_QUERY_ACCELERATION(
        LAST_QUERY_ID())) AS j);
