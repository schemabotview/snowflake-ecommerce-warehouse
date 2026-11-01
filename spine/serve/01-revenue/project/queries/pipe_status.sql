SELECT PARSE_JSON(SYSTEM$PIPE_STATUS('PIPE_PAYMENTS')):executionState::string
         AS pipe,
       (SELECT COUNT(*) FROM PAYMENTS) AS payments;
