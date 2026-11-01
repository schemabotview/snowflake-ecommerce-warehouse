import type { Section } from '../types'

export const mv: Section = {
  id: 'mv',
  title: "Materialised views and search optimisation",
  scene: 'perform-mv',
  narration:
    "Some questions are asked so often that it is worth storing the answer. The first statement in the editor creates a materialised view: daily revenue from the paid order lines, one row a day. Unlike an ordinary view, its result is stored, and Snowflake keeps it up to date by itself whenever the order lines change. The file then asks for November's revenue twice, once from the order lines and once from the view, and after each, it reads the query profile. The side pane's second table compares them, from the run. The order lines query scanned four thousand one hundred and seventy five rows to add them up. The view query read thirty rows, one per day of November, with an operator called materialized view scan. The same answer, from more than a hundred times fewer rows. The bottom of the file looks at a second feature, search optimisation, which builds an index like structure so that looking up a single value, such as one order id, can skip almost every partition. It is not switched on here. Instead, Snowflake's own estimate function says what it would cost on this table, and the third table shows the estimate: a tiny build cost in credits, storage too small to show, and no maintenance figure yet. On a table this small it would not be worth anything, and on a large table looked up by id it often is. Both features have the same catch, which the note spells out: they are maintained in the background, on credits you do not see in a warehouse. The view was a measurement, so the last statement drops it. Next, a feature for the queries that do not fit.",
}
