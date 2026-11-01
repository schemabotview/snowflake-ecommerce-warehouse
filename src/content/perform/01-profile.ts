import type { Section } from '../types'

export const profile: Section = {
  id: 'profile',
  title: "The query profile",
  scene: 'perform-profile',
  narration:
    "The warehouse now answers every question finance and marketing have asked. The next question is how fast, and at what cost. Before changing anything, look at how Snowflake actually runs a query. This frame is the dashboard's main query: November's revenue by day and by product category, from the order lines joined to the date and product dimensions. Snowsight draws a query profile as a picture; the same information is available as rows, from a function called get query operator stats, and that is what this step read, straight after running the query. Each box is one operator from the run, with the rows it passed on and its share of the time. Read each column from the top. On the left, the order lines are scanned, then filtered, then partly aggregated. In the middle, the date dimension is scanned and filtered down to thirty rows, the days of November, and joined to the order lines. On the right, the sixty six product versions are scanned, joined in, and the rows are aggregated by day and category, sorted, and returned. The operator marked in red is where nearly all the time went: reading the order lines. That is normal. In a warehouse the expensive part of a query is almost always reading data, so making a query fast mostly means reading less of it. There is a hint of that in the profile already: the operator called join filter. Snowflake used the dates the join needed to skip some order lines before they reached the join. How Snowflake avoids reading data is called pruning, and it is next.",
}
