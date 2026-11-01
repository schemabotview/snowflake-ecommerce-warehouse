-- The stage's directory table learns of new files when asked.
ALTER STAGE RAW.SHOPWAVE.LANDING REFRESH
  ->> SELECT COUNT(*) AS files_registered FROM $1;
-- What landed, by source folder.
SELECT SPLIT_PART(relative_path, '/', 1) AS source,
       COUNT(*) AS files,
       ROUND(SUM(size) / 1e6, 1) AS mb
FROM DIRECTORY(@RAW.SHOPWAVE.LANDING)
GROUP BY 1
ORDER BY files DESC;
