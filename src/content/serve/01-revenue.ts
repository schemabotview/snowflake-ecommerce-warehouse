import type { Section } from '../types'

export const revenue: Section = {
  id: 'revenue',
  title: "The revenue mart",
  scene: 'serve-revenue',
  narration:
    "The star answers any question, but a dashboard asks the same few questions all day, and it should not have to know how the star fits together. So the last layer is a mart built for the dashboard, in its own schema, B I. The editor's model is the first: mart revenue. It joins the order lines to the date and the product dimensions, keeps paid orders only, and collapses everything to one row per day and category: how many orders, the revenue in euros, and the average order value. d b t builds it as a table of a little over two thousand rows, one for each day and category that had sales. The side pane's diagram is the whole idea: the dashboard reads the mart, never the star, so the star can change shape without breaking a chart. The query then reads Black Friday week back from the mart, and the table shows it, day by day. Most days bring in four or five thousand euros. Black Friday, the twenty seventh of November, brings in ninety eight thousand: about twenty times an ordinary day, the spike the data generator was told to plant, now visible in one row of a mart. One caution is written under it. The orders and average order value columns are per category, so an order that bought a book and a lipstick counts once in books and once in beauty. A day's orders are not the sum of its rows, which is the non additive measure from course nine again. The revenue column, though, adds up safely. Revenue is one question; whether customers come back is another.",
}
