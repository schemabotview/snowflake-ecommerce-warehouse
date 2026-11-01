import type { Section } from '../types'

export const returns: Section = {
  id: 'returns',
  title: "Returns",
  scene: 'facts-returns',
  narration:
    "A return undoes part of a sale, so finance wants to see returns beside the lines they undo: which products come back, why, and how much was refunded. The returns arrive from Shopwave's warehouses as a monthly C S V, loaded and checked in course five. The editor's model, F C T returns, gives each returned line its own row. The first block lists the order lines with each one's product id, taken from the product dimension. The select then joins each return to the line it undoes: the same order, and the same product. From that line it takes the keys, so a return can be sliced by customer or product exactly as a sale can, and the refund, which is the line's amount in euros. If one order held the same product twice, the last line keeps just the first match, so a return is never counted twice. Look at the side pane. The returns by reason, from the run. Every one of the hundred and eighty five found its order line: the matched column equals the returns column on every row. And the reasons are as each warehouse team typed them, in French, German and English, so the same reason appears more than once. Mapping them to one list would be a small dimension of its own. Returns came from files. The next fact comes from clicks.",
}
