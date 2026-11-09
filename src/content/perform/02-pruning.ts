import type { Section } from '../types'

export const pruning: Section = {
  id: 'pruning',
  title: "Pruning",
  scene: 'perform-pruning',
  narration:
    "Snowflake stores a table as micro partitions, and for every partition it keeps a little metadata, including the smallest and largest value of every column. When a query filters on a column, Snowflake compares the filter with each partition's range first, and a partition whose range cannot contain a match is never read. That is pruning, and it is the side pane's first diagram. The editor's file measures it on the order lines. The first query asks Snowflake how the table is laid out by order date. The table in the side pane is its answer: eight partitions, each one overlapping all seven others, and a depth of eight. Depth is how many partitions a single date could be in, so eight means any date might be in any partition. Even a table this small is written as eight partitions, by the eight threads of an extra small warehouse working side by side. The second query sums November's orders, and the third asks the query profile how many partitions the scan read: eight of eight. Nothing was skipped. Every partition holds orders from the whole year, because the table was written in whatever order the join produced them, so every partition's range includes November. The filter was correct, the answer was correct, and Snowflake still had to read the whole table. On a table this size that costs nothing worth measuring. On a table of years, with thousands of partitions, it is the difference between reading a month and reading everything. The fix is to control how the rows are laid out, with a clustering key.",
}
