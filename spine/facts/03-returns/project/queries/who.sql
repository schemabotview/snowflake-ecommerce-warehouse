-- Who am I, which roles may I use, and what may Ravi use?
SELECT CURRENT_USER() AS me, CURRENT_ROLE() AS role;
SELECT VALUE::string AS my_roles
FROM TABLE(FLATTEN(PARSE_JSON(CURRENT_AVAILABLE_ROLES())))
ORDER BY 1;
SHOW GRANTS TO USER RAVI ->> SELECT "role" AS ravis_roles FROM $1;
