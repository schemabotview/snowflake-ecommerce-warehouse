import type { Section } from '../types'

export const clustering: Section = {
  id: 'clustering',
  title: "Clustering keys",
  scene: 'perform-clustering',
  narration:
    "If rows from the same month were stored together, a query for one month could skip most of the table. A clustering key tells Snowflake which column to keep rows together by. Here the change is one line in the model's config: cluster by order date key. When d b t builds a table with a clustering key, it sorts the rows by that key as it writes them, and it declares the key on the table. The first command rebuilds the order lines from scratch, with full refresh, so the whole table is written in the new order. Then the same two questions as last time. The side pane puts the two runs side by side. Before: eight partitions, each overlapping seven others, with a depth of eight. After: still eight partitions, but none of them overlap, and the depth is one. Each partition now holds one stretch of the year, so its smallest and largest dates are close together. And the November query read two partitions of the eight, not all of them. The answer, three hundred and twenty two thousand euros, is the same, because pruning never changes a result, only how much is read to get it. There is a cost, and the note names it. A table with a clustering key gets automatic clustering: as new orders are merged in each night, the table drifts out of order, and Snowflake re sorts it in the background, with its own compute, billed separately. For a table queried by date all day, that is usually worth it. For a small table, or one rarely filtered, it is not. Reading less is one lever. The other is how much compute does the reading.",
}
