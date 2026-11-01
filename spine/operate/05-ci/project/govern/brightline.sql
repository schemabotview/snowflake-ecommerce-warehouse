-- In Brightline's reader account: a warehouse (Shopwave pays for it),
-- the share mounted as a database, and the campaign view, read in place.
CREATE WAREHOUSE IF NOT EXISTS BRIGHTLINE_WH WAREHOUSE_SIZE = XSMALL
  AUTO_SUSPEND = 60 INITIALLY_SUSPENDED = TRUE;
USE WAREHOUSE BRIGHTLINE_WH;
CREATE DATABASE IF NOT EXISTS SHOPWAVE
  FROM SHARE <% provider %>.SHOPWAVE_CAMPAIGNS;
SELECT campaign_id, SUM(visits) AS visits, SUM(buying_visits) AS buying
FROM SHOPWAVE.BI.CAMPAIGN_STATS GROUP BY 1 ORDER BY 2 DESC;
-- Everything else in Shopwave's database stays out of reach:
SELECT COUNT(*) FROM SHOPWAVE.MARTS.FCT_SESSIONS;
