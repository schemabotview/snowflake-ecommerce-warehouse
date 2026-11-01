-- Scale UP: dbt's warehouse one size bigger (twice the credits per hour).
-- Scale OUT: the BI warehouse may add up to two more clusters under load.
USE ROLE SYSADMIN;
ALTER WAREHOUSE WH_TRANSFORM SET WAREHOUSE_SIZE = SMALL;
ALTER WAREHOUSE WH_BI SET MIN_CLUSTER_COUNT = 1 MAX_CLUSTER_COUNT = 3
  SCALING_POLICY = STANDARD;
SHOW WAREHOUSES LIKE 'WH_%'
  ->> SELECT "name", "size", "min_cluster_count" AS min_clusters,
             "max_cluster_count" AS max_clusters FROM $1;
