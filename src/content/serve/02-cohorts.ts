import type { Section } from '../types'

export const cohorts: Section = {
  id: 'cohorts',
  title: "Cohort retention",
  scene: 'serve-cohorts',
  narration:
    "A shop lives on customers who come back, and the standard way to measure that is a cohort table. A cohort is a group of customers who started together, here the month of each customer's first paid order. The editor's model, mart cohorts, works it out in three steps, the side pane's diagram. The first block lists which months each customer ordered in. The second finds each customer's first month, their cohort. The third counts each cohort's size. The final select then counts, for every cohort and every month after it, how many of its customers ordered again, and divides by the cohort's size. The query pivots the first six cohorts into the triangle in the side pane, from the run. Each row is a cohort, with its size, and each column is a number of months later. January's cohort is large, nine hundred and five customers, and the note explains why it is not a true cohort: the data starts on the first of January, so every customer who already existed makes their first order of the year in January, and joins it. From February on, the cohorts are real: three hundred and fifty six new customers, then fewer each month, because there are fewer customers left who have never ordered. Read along a row: in this data, between about thirty and fifty percent of a cohort order again in each later month, and the rows barely fade. Real cohorts usually fall away faster, and that difference is exactly what a retention chart is for. Before more marts, there is a problem to fix: Shopwave has more than one idea of revenue.",
}
