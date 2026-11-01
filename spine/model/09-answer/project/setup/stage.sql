-- One place for every file Shopwave sends: an internal stage.
CREATE STAGE IF NOT EXISTS RAW.SHOPWAVE.LANDING
  DIRECTORY = (ENABLE = TRUE)
  COMMENT = 'Every Shopwave source file, as it arrived';
