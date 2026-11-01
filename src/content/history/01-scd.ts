import type { Section } from '../types'

export const scd: Section = {
  id: 'scd',
  title: "SCD types",
  scene: 'history-scd',
  narration:
    "Customers change. They move house, and their loyalty tier rises as they spend. The terminal on the right shows one real customer, number eighty one, in the shop's data: signed up in Spain, then, on the sixteenth of January, moved to Austria; silver in March, gold in May. Our customer dimension has one row per customer, so what should it say? Kimball names the answers slowly changing dimensions, types zero to three, and this frame applies each to customer eighty one. Type zero never changes: the country at signup, forever, which is right for things that genuinely never change, like a date of birth, and wrong for an address. Type one overwrites: the row now says Austria. That is simple and keeps the dimension small, but history is lost, and worse, every order customer eighty one placed while living in Spain now reports as Austrian, so last year's revenue by country changes every time anyone moves. Type three keeps one step of history in an extra column, the previous country: enough for one change, not for three. Type two adds a new row for every version, each with its own surrogate key and the dates it was valid between. An order points at the version valid on the day it was placed, so it keeps its country forever, and the dimension remembers everything. This course uses type two for customers and for prices, which is exactly why course six gave every dimension a key of its own. Next, building type two with d b t.",
}
