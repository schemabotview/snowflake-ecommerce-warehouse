import type { Section } from '../types'

export const clone: Section = {
  id: 'clone',
  title: "Zero-copy clone",
  scene: 'operate-clone',
  narration:
    "A developer who wants to change the warehouse needs a copy of it to work on: the same tables, the same real data, but somewhere a mistake costs nothing. In most databases, a copy of a whole warehouse takes hours and doubles the storage bill. In Snowflake it takes one statement, create database clone, and stores nothing. That is the subject of this frame, and the run on the right shows it. The first statement clones all of analytics, every schema and table, into analytics dev. The next query counts the order lines in both: thirty five thousand and forty three, in each. Then the storage. The original owns about a megabyte of order lines. The clone owns zero bytes. Look at the diagram on the left. A Snowflake table is a list of micro partitions, and a clone is a new list pointing at the same partitions. Nothing is copied until something changes. When the copy changes a row, Snowflake writes a new partition holding that change, for the copy alone, and the original is untouched. The step does that, updating order eighteen thousand in the copy. The note is honest about the next reading: storage figures are computed in the background, so straight after the update, the clone still shows zero bytes. The rows, though, are right in both. The second note says what this is for: a developer's database, or a pull request's, made in seconds and paid for only as far as it drifts from production. Snowflake keeps old versions of tables for another reason too: to undo mistakes.",
}
