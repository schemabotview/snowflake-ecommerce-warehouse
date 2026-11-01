-- Grants on tables that do not exist yet.
USE ROLE SECURITYADMIN;
SHOW FUTURE GRANTS IN SCHEMA RAW.SHOPWAVE
  ->> SELECT "privilege", "grant_on", "grantee_name" FROM $1 ORDER BY 3, 1;
SHOW FUTURE GRANTS IN SCHEMA ANALYTICS.MARTS
  ->> SELECT "privilege", "grant_on", "grantee_name" FROM $1 ORDER BY 3, 2;
