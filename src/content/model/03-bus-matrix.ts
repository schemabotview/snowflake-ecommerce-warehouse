import type { Section } from '../types'

export const busMatrix: Section = {
  id: 'bus-matrix',
  title: "The bus matrix",
  scene: 'model-bus-matrix',
  narration:
    "Sales is one process. Shopwave also fulfils orders, takes returns, has visitors browsing its site, runs a checkout funnel, and wants a picture of each customer month by month. Each is a business process, and each gets a fact table of its own. The danger is building each one alone, with its own idea of what a customer or a date is, so that sales and returns can never be compared. Kimball's answer is the bus matrix, and this frame is Shopwave's, drawn as a plan, not run. Each row is a business process and the fact table that will record it, with the course that builds it. Each column is a dimension. A dot means that fact uses that dimension. Read down a column, and you see why the matrix matters: the customer dimension is shared by sales, fulfilment, returns, visits and the monthly snapshot. These are conformed dimensions: built once, used by every fact, with the same keys and the same meanings. That is what lets an analyst drill across: take revenue from sales and refunds from returns, line them up by the same customer and the same month, and trust that they mean the same things. The matrix is also a build plan. Sales comes first, in this course, with the date, customer and product dimensions. Course eight adds the currency dimension, and course nine the remaining facts, each reusing what is already there. Now, the first fact table, built by hand.",
}
