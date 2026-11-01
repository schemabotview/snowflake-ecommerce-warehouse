-- The roles every account starts with, and who inherits whom.
USE ROLE ACCOUNTADMIN;
SHOW ROLES
  ->> SELECT "name", "granted_roles" AS inherits,
             "assigned_to_users" AS users
      FROM $1 ORDER BY 1;
SHOW GRANTS TO ROLE ACCOUNTADMIN
  ->> SELECT "name" AS granted_role FROM $1
      WHERE "granted_on" = 'ROLE' ORDER BY 1;
