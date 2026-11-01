-- The nightly job as a task graph: snapshot the customers, then build and
-- test everything. Both run the dbt project inside Snowflake.
CREATE OR REPLACE TASK NIGHTLY_SNAPSHOT
  WAREHOUSE = WH_TRANSFORM
  SCHEDULE = 'USING CRON 0 2 * * * Europe/Berlin'
AS EXECUTE DBT PROJECT SHOPWAVE_DBT ARGS = 'snapshot';
CREATE OR REPLACE TASK NIGHTLY_BUILD
  WAREHOUSE = WH_TRANSFORM
  AFTER NIGHTLY_SNAPSHOT
AS EXECUTE DBT PROJECT SHOPWAVE_DBT ARGS = 'build';
-- A child runs when its root does. The root's schedule stays off: a trial
-- account should not rebuild itself every night.
ALTER TASK NIGHTLY_BUILD RESUME;
SHOW TASKS LIKE 'NIGHTLY%'
  ->> SELECT "name", "schedule", "state" FROM $1;
