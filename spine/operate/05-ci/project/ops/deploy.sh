#!/usr/bin/env bash
# Put the dbt project INTO Snowflake, as an object a task can run.
exec snow dbt deploy SHOPWAVE_DBT --source dbt \
  --profiles-dir ops/snowflake --dbt-version 1.10.15 \
  --role TRANSFORMER --warehouse WH_TRANSFORM \
  --database ANALYTICS --schema MARTS
