-- The marketing calendar: four campaigns, one JSON array.
CREATE TABLE IF NOT EXISTS CAMPAIGNS (
  CAMPAIGN_ID VARCHAR, CHANNEL VARCHAR, STARTS DATE, ENDS DATE);
COPY INTO CAMPAIGNS FROM (
  SELECT $1:campaign_id, $1:channel, $1:start, $1:end
  FROM @LANDING/campaigns.json)
  FILE_FORMAT = (TYPE = JSON STRIP_OUTER_ARRAY = TRUE)
  ->> SELECT "status", "rows_loaded" FROM $1;
