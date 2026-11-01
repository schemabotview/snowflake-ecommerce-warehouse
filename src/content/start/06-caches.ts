import type { Section } from '../types'

export const caches: Section = {
  id: 'caches',
  title: 'Three caches',
  scene: 'start-caches',
  narration:
    "Why does the same query sometimes cost nothing the second time? Snowflake has three caches, and this step shows each. It suspends the warehouse first, so nothing is cached on it, switches off the result cache for the session, and runs one query over the sample order lines. That is the cold run: every micro-partition it needs is read from storage. Then it runs the same query again. The warehouse is still up, and its local disks still hold the partitions the first run read: that is the warehouse cache, in the middle of the frame. It belongs to the running warehouse, any query on it can reuse it, and it is lost when the warehouse suspends, which is the price of auto suspend. Then the step switches the result cache back on and runs the query twice more. The first of those is computed and its result remembered; the second is answered from the result cache, on the left, which lives in cloud services. As long as the query text is identical and the data underneath has not changed, Snowflake returns the stored result without a warehouse at all, for twenty four hours, extended each time it is reused. The third cache, on the right, is metadata: counts, minimums and maximums that cloud services keeps for every partition, which is how the very first step counted a table with no warehouse running. The table under the three shows what each run cost in this recording, read from the query history. Times vary, so read the shape, not the digits. Next, the whole map, and what this course added to it.",
}
