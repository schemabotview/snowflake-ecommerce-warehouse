import type { Section } from '../types'

export const validate: Section = {
  id: 'validate',
  title: "VALIDATION_MODE and ON_ERROR",
  scene: 'load-validate',
  narration:
    "The returns arrive once a month from Shopwave's warehouse, and these files are known to be awkward. So before loading them, the step checks them. The first command creates the returns table. The editor runs copy into with validation mode set to return errors: copy reads every file and reports every row it could not load, and writes nothing at all. The summary query after the arrow groups those errors by message. Look at the side pane to see what the files contain. The twelve monthly files are read here as plain U T F eight, the format every other source uses, and they turn out to have two different problems. The first is unreadable text: every row whose return reason has an accent in it, which is a lot of them. The second is malformed rows: a few each month with a field missing or a date in the wrong format. The table in the middle is the run's count of each. They need different fixes, and that is the point of validating first: you learn which problem you have before choosing what to do. The last table is that choice. On error says what copy does when it meets a bad row: abort statement, the default, loads nothing; skip file skips that whole file; continue loads every good row and counts the bad ones, which can then be looked at. For the malformed rows, continue is right. For the unreadable text, no on error setting helps, because the problem is the encoding. We come back to that after the clicks.",
}
