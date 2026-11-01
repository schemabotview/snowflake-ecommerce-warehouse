-- The same COPY, again. Snowflake remembers every file it loaded.
COPY INTO ORDERS FROM (
  SELECT $1, $2, $3, $4, $5, $6, METADATA$FILENAME, CURRENT_TIMESTAMP()
  FROM @LANDING/orders/) FILE_FORMAT = (FORMAT_NAME = FF_CSV);
SELECT COUNT(*) AS orders, COUNT(DISTINCT _FILE) AS files FROM ORDERS;
