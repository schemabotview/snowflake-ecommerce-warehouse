import type { Section } from '../types'

export const monthly: Section = {
  id: 'monthly',
  title: "A periodic snapshot",
  scene: 'facts-monthly',
  narration:
    "Finance reviews customers once a month: how many orders each placed, and which loyalty tier each was in when the month closed. That is a periodic snapshot: one row per customer per month, for every customer and every month, whether they ordered or not. The editor's model starts from the months, taken from the date dimension, and cross joins them with every customer, so a customer who did nothing in March still has a March row with zero orders. A missing row and a zero mean different things, and this table never leaves a gap. The orders block counts each customer's paid orders by month. And the tier comes from course eight's snapshot: of customer eighty one's versions, the one valid on the last day of the month. That join is the point-in-time join of course eight again, this time on a date the snapshot chose. Look at the side pane. The run counted the rows: twenty four thousand, which is two thousand customers times twelve months, exactly, the shape of the table checked by its size. Under it, customer eighty one's first six months, from the run. Two orders a month in the first quarter, then three, then five in May. Their tier moves with the snapshot: bronze, then silver at the end of March, then gold at the end of May. In June, one order, and still gold. A periodic snapshot makes questions like how many gold customers we had at each month end a simple filter. But summing its columns needs care, and that is the next section.",
}
