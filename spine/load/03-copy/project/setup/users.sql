-- A colleague: Ravi, from the BI team. A new user can do almost nothing.
USE ROLE USERADMIN;
CREATE USER IF NOT EXISTS RAVI
  LOGIN_NAME = 'ravi'
  DISPLAY_NAME = 'Ravi (BI)'
  DEFAULT_ROLE = PUBLIC
  COMMENT = 'Shopwave BI analyst';
