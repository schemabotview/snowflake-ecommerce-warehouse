import type { Section } from '../types'

export const rowColumn: Section = {
  id: 'row-column',
  title: 'OLTP vs OLAP',
  scene: 'intro-row-column',
  narration:
    "Two kinds of database answer two kinds of question. O L T P, online transaction processing, is the shop: one order at a time. O L A P, online analytical processing, is the warehouse: all the orders at once. The difference starts with how the rows are stored, so this lab stores Shopwave's order lines for the year twice and measures what each layout must read. On the left, by row, as the shop database stores them: each order line's values sit together. Fetching one order reads only its lines, a few dozen bytes, side by side. But revenue for the year needs two columns, quantity and unit price, and a row store must read every column of every row to get them. In the middle, by column, as a warehouse stores them: each column's values sit together, compressed. Revenue now reads just those two columns, a small fraction of the bytes. The price moves to the other question: one order means fetching a piece of every column and putting the row back together. Underneath, the file itself, column by column: what each one costs to read. And on the right, the lab's own output. The same split runs through how the data is modelled. The shop's schema is normalised: each fact stored once, many tables, joined for each question. A warehouse's is dimensional: facts at a declared grain, with dimensions around them, built for exactly these questions. Snowflake is a column store, and that is the warehouse we will build.",
}
