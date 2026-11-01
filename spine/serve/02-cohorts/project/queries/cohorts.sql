-- The cohort triangle: % of each month's new customers ordering again.
SELECT cohort, MAX(cohort_size) AS size,
       MAX(IFF(months_after = 1, retention_pct, NULL)) AS m1,
       MAX(IFF(months_after = 2, retention_pct, NULL)) AS m2,
       MAX(IFF(months_after = 3, retention_pct, NULL)) AS m3,
       MAX(IFF(months_after = 4, retention_pct, NULL)) AS m4,
       MAX(IFF(months_after = 5, retention_pct, NULL)) AS m5
FROM BI.MART_COHORTS WHERE cohort <= '2026-06'
GROUP BY 1 ORDER BY 1;
