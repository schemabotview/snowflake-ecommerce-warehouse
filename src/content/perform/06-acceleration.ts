import type { Section } from '../types'

export const acceleration: Section = {
  id: 'acceleration',
  title: "Query acceleration",
  scene: 'perform-acceleration',
  narration:
    "Most queries a dashboard runs are small. But now and then someone runs one huge scan, and sizing the whole warehouse up for that one query means paying the bigger size every hour it runs. The query acceleration service is Snowflake's answer, and the side pane's diagram shows the idea. The warehouse runs the query as usual, but parts of a big scan can be handed to a pool of shared compute, many servers for a few seconds, up to a limit set as a scale factor of the warehouse. It is billed only for the seconds it is used. Not every query can use it, so before switching it on, Snowflake will estimate, for any query that has already run, whether acceleration would have helped. The editor's file runs the kind of query that might qualify: every click of the year, read from the raw table and counted by campaign. The first table in the terminal is its answer. Most clicks came with no campaign at all, and the newsletter and retargeting brought in about fifty thousand each. Then the file asks for the estimate for that query, and the side pane shows the result: ineligible, with a scale factor of zero. That is the honest answer for this warehouse. According to Snowflake's documentation, acceleration helps scans of many partitions that dominate a query's time, and a year of clicks here fits in eight partitions, too few to split up. So it stays switched off. On a large table, the same estimate is the right first step, run before paying for anything. All of this has been about spending less. The last section finds out where the credits actually go.",
}
