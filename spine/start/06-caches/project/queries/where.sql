-- Where this account lives.
SELECT CURRENT_ORGANIZATION_NAME() AS org,
       CURRENT_ACCOUNT_NAME() AS account,
       CURRENT_ACCOUNT() AS locator,
       CURRENT_REGION() AS region;
