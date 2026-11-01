import type { Section } from '../types'

export const fact: Section = {
  id: 'fact',
  title: "The fact table",
  scene: 'model-fact',
  narration:
    "The first fact table is the one the grain decided: F C T order lines, one row per order line. In this course it is written by hand, as one create table statement, so that every part is visible; the next course rebuilds it properly with d b t. The editor shows it. It reads the order items from raw and joins each line to its order. The order id and line number identify the row. The order id has no dimension of its own, because everything about an order is already somewhere else; Kimball calls that a degenerate dimension. Then the pointers: the order date, the customer and the product, by the shop's own ids for now. Then the order's status, and the measures: quantity, unit price, and amount in euros. The comments mark which measures add up. Quantity and amount can be summed across any rows. Unit price cannot: adding two prices means nothing. Look at the side pane. This is the star, and it will stay in this shape for the rest of the course: the fact in the middle, its dimensions on either side, still empty because they do not exist yet, and the measures tinted. Under it, the check the second command ran: the fact's row count, the number of distinct order and line pairs, and the number of lines in raw. If the grain holds, all three are equal: one row per order line, none lost, none doubled. A fact with only ids is hard to read, though. It needs its dimensions.",
}
