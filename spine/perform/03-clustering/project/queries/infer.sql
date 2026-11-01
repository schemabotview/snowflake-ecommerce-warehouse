-- What shape are the files, on either side of June 1?
SELECT 'May 31' AS day, COLUMN_NAME, TYPE
FROM TABLE(INFER_SCHEMA(LOCATION => '@LANDING/clickstream/2026-05-31/',
                        FILE_FORMAT => 'FF_JSON'))
UNION ALL
SELECT 'June 1', COLUMN_NAME, TYPE
FROM TABLE(INFER_SCHEMA(LOCATION => '@LANDING/clickstream/2026-06-01/',
                        FILE_FORMAT => 'FF_JSON'))
ORDER BY 2, 1;
