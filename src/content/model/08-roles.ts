import type { Section } from '../types'

export const roles: Section = {
  id: 'roles',
  title: "Degenerate and role-playing dimensions",
  scene: 'model-roles',
  narration:
    "Two kinds of dimension look odd at first. The first is already in the fact: the order id. It identifies the order a line belongs to, but there is no order dimension, because everything about an order, its date, customer and status, is already on the line or in another dimension. A key with no table behind it is a degenerate dimension, and it is useful: it groups lines into orders, and it is how an analyst finds a particular order. The second is a role playing dimension, and the fact gains one in this step. The fact is rebuilt with a second date key: the date the order was paid, taken from the order's first payment, so the order paid twice is still counted once. Now the fact has two dates, and both point at the same date dimension. Look at the side pane: two edges from the fact into the one date table, one solid for the order date and one dashed for the paid date. One dimension, playing two roles. The editor's query uses both roles at once, joining the date dimension twice, once as ordered and once as paid, and lists orders placed on one day but paid the next. The table under the star is the run's first five: orders placed late at night, paid after midnight. The second query counts orders with no paid date at all: the unpaid orders the generator plants. Nothing in the model stops them. Course seven turns them into a failing test. First, the question this course was built for.",
}
