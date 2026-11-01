import type { Section } from '../types'

export const types: Section = {
  id: 'types',
  title: "Three kinds of fact table",
  scene: 'facts-types',
  narration:
    "Every fact table so far has been one shape: F C T order lines, one row for each thing that happened. That is the most common shape, but it is not the only one, and some of Shopwave's questions cannot be answered by it. This frame is Kimball and Ross's answer, from The Data Warehouse Toolkit, drawn on the tables this course builds. Nothing is run here. The first column is the transaction fact. One row is one event, an order line, written when the event happens and never changed afterwards. It answers what happened. The second is the periodic snapshot. One row is a customer in a month, written for every customer at the end of every month, whether anything happened or not. Customer eighty one, the one course eight followed, gets a row for January, February and March, and so does a customer who never ordered at all. It answers how things stood at each period's end. The third is the accumulating snapshot. One row is a whole order, from placed to delivered, and unlike the other two, its row is updated: each milestone fills in as the order reaches it. The two sample rows are real orders from this course's run: one delivered two days after it was placed, one placed on New Year's Eve and not shipped yet. It answers how far each order has got, and how long each step took. Underneath, a fourth shape: a fact with no measure at all, where the row itself is the fact. Each gets a section. The accumulating snapshot comes first.",
}
