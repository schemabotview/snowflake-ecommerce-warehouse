import type { Section } from '../types'

export const share: Section = {
  id: 'share',
  title: "Sharing with Brightline",
  scene: 'serve-share',
  narration:
    "Shopwave could export the campaign numbers to a file every week and email it to Brightline. Snowflake offers something better: a share. A share is a set of grants on objects, given to another account, which then reads them in place. Nothing is copied, so Brightline always sees today's numbers. The side pane's diagram is the path. The first command, as an administrator, creates the share, shopwave campaigns, and grants it the database, the B I schema, and select on the secure view, and nothing else. Brightline has no Snowflake account of its own, so the second script creates one for it: a reader account. Shopwave owns it and pays for its compute, and it can only read what is shared with it. The script keeps the generated admin password in a key file, never on screen, adds the reader account to the share, and shows the share going out, the first table in the side pane. The third command runs inside Brightline's account. The editor's file creates a small warehouse there, which Shopwave pays for, mounts the share as a database, and reads the campaign view. The second table is Brightline's answer, from inside its own account, and it matches what the analyst saw in the last section, row for row. Finally the file tries to read the sessions table through the same database, and is refused: that schema does not exist for Brightline. Only what was granted to the share crosses over. Everything is now in place for the dashboard.",
}
