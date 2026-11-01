-- Each team's role, and exactly what it holds.
USE ROLE SECURITYADMIN;
SHOW GRANTS TO ROLE LOADER
  ->> SELECT "privilege", "granted_on", "name" FROM $1 ORDER BY 2, 3, 1;
SHOW GRANTS TO ROLE ANALYST
  ->> SELECT "privilege", "granted_on", "name" FROM $1 ORDER BY 2, 3, 1;
