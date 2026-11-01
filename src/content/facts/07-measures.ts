import type { Section } from '../types'

export const measures: Section = {
  id: 'measures',
  title: "Measures",
  scene: 'facts-measures',
  narration:
    "A fact table's numbers are not all the same kind, and a dashboard that sums the wrong one gives a confident wrong answer. The side pane's first table names the three kinds. Additive measures, like revenue and quantity, can be summed across any dimension. Semi additive measures, like how many customers were gold at a month end, can be summed across customers, but not across time. Non additive measures, like average order value, cannot be summed at all. The editor's file tests the last two against the warehouse. The first query computes A O V twice. The right way: total revenue divided by total orders. The tempting way: work out each customer's own average order value, and average those. The second table in the side pane is the run's answer, and the two disagree by about eight euros. The averaged version gives every customer the same weight, so a customer with one expensive order counts as much as one with twenty ordinary orders. A ratio has to be rebuilt from its parts, the sums, at whatever level it is shown. The second query uses the monthly snapshot from the last section. Counting gold customers at the end of December gives a hundred and thirty four. Adding up the gold customers of all twelve month ends gives six hundred and twenty four, which counts the same customers again and again, once for every month they stayed gold. Across time, a semi additive measure takes the last value, or an average, never a sum. One kind of fact remains: one with no measure at all.",
}
