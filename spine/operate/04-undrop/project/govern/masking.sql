-- Customer emails are personal data: only the analytics team sees them.
-- Everyone else gets the domain, which is enough to count by provider.
CREATE MASKING POLICY IF NOT EXISTS PII_EMAIL AS (email VARCHAR)
  RETURNS VARCHAR ->
  CASE WHEN CURRENT_ROLE() = 'TRANSFORMER' THEN email
       ELSE '*****@' || SPLIT_PART(email, '@', 2) END;
SHOW MASKING POLICIES ->> SELECT "name", "owner" FROM $1;
