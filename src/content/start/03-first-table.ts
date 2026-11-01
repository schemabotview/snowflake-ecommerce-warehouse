import type { Section } from '../types'

export const firstTable: Section = {
  id: 'first-table',
  title: 'A first table and query',
  scene: 'start-first-table',
  narration:
    "Shopwave's first table in Snowflake is its products, small enough to load by hand. The terminal does it in four steps. First it makes a folder for exports, then asks PostgreSQL to copy the products table out to a C S V file. Then it runs the file in the editor. It sets the warehouse and the schema, and creates a table with the same columns as the shop's, in Snowflake's types. Then it puts the file into the table's own stage: every table in Snowflake has one, a small place for files on their way in, written with a percent sign. Course five builds a proper stage for every source; this one is enough for a single file. Finally, copy into loads the file's rows into the table, skipping the header. The last command asks the first question of the warehouse: how many products there are in each category, and their average price. Look at the side pane to follow that question's round trip, because every query in this course takes the same one. The client sends the S Q L. Cloud services parses and plans it. The warehouse, W H LOAD, resumes and does the work, reading the table's micro-partitions from storage, and the answer travels back. A minute later, with nothing more to do, the warehouse suspends again. Under the trip is the answer itself, as Snowflake returned it. One question does not tell us much about the warehouse's size, though, so next we ask a bigger one, twice.",
}
