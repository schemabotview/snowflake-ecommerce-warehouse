-- Check the files before loading them: nothing is written.
COPY INTO RETURNS FROM @LANDING/returns/
  FILE_FORMAT = (FORMAT_NAME = FF_CSV)
  VALIDATION_MODE = RETURN_ERRORS
  ->> SELECT LEFT("ERROR", 52) AS error, COUNT(*) AS row_count
      FROM $1 GROUP BY 1 ORDER BY 2 DESC;
