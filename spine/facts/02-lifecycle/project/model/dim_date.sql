-- One row per day: every way a report might group a date.
CREATE OR REPLACE TABLE DIM_DATE AS
SELECT
    TO_NUMBER(TO_CHAR(d, 'YYYYMMDD'))   AS date_key,
    d                                   AS date,
    DAYNAME(d)                          AS day_name,
    DAYOFWEEKISO(d) >= 6                AS is_weekend,
    TO_CHAR(d, 'YYYY-MM')               AS month,
    'Q' || QUARTER(d)                   AS quarter,
    YEAR(d)                             AS year,
    d = '2026-11-27'                    AS is_black_friday
FROM (
    SELECT DATEADD(day, SEQ4(), '2026-01-01'::date) AS d
    FROM TABLE(GENERATOR(ROWCOUNT => 365))
);
