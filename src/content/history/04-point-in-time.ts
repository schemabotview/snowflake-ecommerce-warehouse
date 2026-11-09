import type { Section } from '../types'

export const pointInTime: Section = {
  id: 'point-in-time',
  title: "The price at the time of order",
  scene: 'history-point-in-time',
  narration:
    "Both dimensions now have versions, so the fact has to choose one, and the right one is the version valid at the moment the order was placed. The editor shows the change in the fact. The join to the customer dimension now has a second condition: the order's time must fall on or after the version's valid from, and before its valid to. The same for the product, by date. Exactly one version matches each order line, and its surrogate key is stored on the fact row for good. Look at the side pane to follow one order line through that join: placed at a moment, matched to the version valid then, and keeping that version's key. The terminal rebuilds the customer dimension and the fact with a full refresh, then asks two questions. The first lists customer eighty one's orders: the country and tier they had when they ordered, and the country they have now. The table in the side pane is the run's answer: the early orders keep their original country, the later ones say Austria, and every one of them would say Austria under type one. The second checks prices: every order line's unit price, compared with its product version's list price on the day it was ordered. The card at the bottom is the result: they match, because the shop charged the price it listed that day, and the warehouse now knows which price that was. History raises one more problem, though: some facts arrive late.",
}
