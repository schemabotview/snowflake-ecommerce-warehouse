-- What was sent against what loaded: count the files' LINES, not records.
CREATE FILE FORMAT IF NOT EXISTS FF_LINES
  TYPE = CSV FIELD_DELIMITER = NONE SKIP_HEADER = 1
  ENCODING = 'ISO-8859-1';
SELECT (SELECT COUNT(*) FROM @LANDING/returns/ (FILE_FORMAT => 'FF_LINES'))
         AS lines_sent,
       (SELECT COUNT(*) FROM RETURNS) AS rows_loaded;
