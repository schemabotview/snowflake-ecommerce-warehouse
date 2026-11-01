-- Who may use RAW at all?
SHOW GRANTS ON DATABASE RAW
  ->> SELECT "privilege", "grantee_name" FROM $1 ORDER BY 2, 1;
