-- The right encoding for this sender, and skip what still cannot be read.
COPY INTO RETURNS FROM @LANDING/returns/
  FILE_FORMAT = (FORMAT_NAME = FF_CSV_LATIN1)
  ON_ERROR = CONTINUE
  ->> SELECT COUNT(*) AS files, SUM("rows_loaded") AS loaded,
             SUM("errors_seen") AS rejected FROM $1;
