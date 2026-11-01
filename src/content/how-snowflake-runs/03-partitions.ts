import type { Section } from '../types'

export const partitions: Section = {
  id: 'partitions',
  title: 'Micro-partitions',
  scene: 'how-partitions',
  narration:
    "Everything a warehouse reads is stored the same way, in micro-partitions, and they explain most of how Snowflake performs. To see them, this step copies one of the sample tables, the T P C H line item table, into a table of our own, measures it, and drops it again. The terminal shows the copy, then two questions about the result. How many rows, and how many bytes they take once stored. And how Snowflake split them. Look at the left of the frame. When a table is loaded, Snowflake cuts it into micro-partitions: small files, each holding between fifty and five hundred megabytes of data before compression, and each one columnar inside, every column stored and compressed apart, the way the first course's lab measured. A micro-partition is immutable. Snowflake never edits one in place: an update writes new partitions and retires the old ones, which is also what makes time travel and cloning possible later in the course. For every partition, cloud services keeps metadata: among other things, the minimum and maximum of every column. That is what lets a query skip partitions it does not need. Ask for one day of shipping dates, and every partition whose range of dates cannot contain that day is never read. The last number is the clustering depth on the ship date: roughly, how many partitions overlap at any one date. Low depth means good skipping. We come back to pruning and clustering in course ten, on Shopwave's own data. Next: where an account lives.",
}
