import type { Section } from '../types'

export const metrics: Section = {
  id: 'metrics',
  title: "One definition of revenue",
  scene: 'serve-metrics',
  narration:
    "Ask three teams for November's revenue and Shopwave would get three answers. This course already printed two of them. Course ten summed every order line in November; later, it summed paid orders only. The finance team, meanwhile, subtracts refunds. None of them is wrong; they answer different questions under the same name, and that is how a board meeting ends up arguing about numbers instead of decisions. The fix is to define revenue once, in one model, and have every report read it. The side pane's diagram is the definition: paid orders only, in euros, using the order lines' own euro prices so no currencies are ever mixed, and net of what was refunded on those orders, taken from the returns fact of course nine. The editor's model, metrics monthly, implements it: sales by month, refunds joined back to the lines they undo, and the net. The first query puts the three answers for November side by side, from the run. Every order line: three hundred and twenty two thousand euros. Paid orders only: two hundred and eighty eight thousand. Paid, net of refunds: two hundred and eighty six thousand seven hundred. The gaps are explained, line by line: thirty five thousand euros of orders that were never paid, and about twelve hundred euros refunded. The last table is the metric month by month, and November stands out, Black Friday again. From now on, revenue means this table. The rest of this course is about who may see what, starting with the customers' emails.",
}
