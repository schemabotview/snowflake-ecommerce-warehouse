-- What landed: the stage's directory table, by source folder.
SELECT SPLIT_PART(relative_path, '/', 1) AS source,
       COUNT(*) AS files,
       ROUND(SUM(size) / 1e6, 1) AS mb
FROM DIRECTORY(@RAW.SHOPWAVE.LANDING)
GROUP BY 1
ORDER BY files DESC;
