import type { Section } from '../types'

export const lifecycle: Section = {
  id: 'lifecycle',
  title: "The order lifecycle",
  scene: 'facts-lifecycle',
  narration:
    "Shopwave's operations team wants to know how long orders take: from placed, to paid, to shipped, to delivered. The step starts with the rest of the year's change feed. Course eight loaded the first week of December; this load picks up every other file, and the summary shows three hundred and fifty eight files. Load metadata skips the ones already loaded. Then d b t builds two models: a staging view over the change feed, and the editor's model, F C T order lifecycle. The first block finds, for each order, the first time it was marked shipped and the first time it was marked delivered. The select then puts one order on one row: when it was placed, when it was first paid, those two dates, and a return if there was one, with the days between them as measures. Look at the side pane. The milestones, from the run: twenty thousand and twenty four orders placed, and fewer at every step after, down to the hundred and eighty five returned. An accumulating snapshot is the one fact table whose rows change. Order eighteen thousand has every date filled in; order twenty thousand and twenty, placed on the last day of the year, has nothing after paid, and the next run will fill in its dates as it moves. This one is rebuilt each run, which is simple and, at this size, cheap. The note gives the measure the table exists for: the average days from placed to delivered. The last milestone, returns, deserves its own fact.",
}
