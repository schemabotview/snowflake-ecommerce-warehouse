import type { Section } from '../types'

export const prices: Section = {
  id: 'prices',
  title: "Price history",
  scene: 'history-prices',
  narration:
    "Prices change too: a fifth of Shopwave's products change price during the year, some twice. But unlike customers, the shop keeps a price log: every price each product has had, and the day it started. When the source keeps its own history, there is nothing to snapshot. The warehouse can model the history directly. The first command loads the price log into raw. The editor shows the product dimension, now built from it. It joins every product to every price it has had, so a product with three prices becomes three rows, three versions, each with its own surrogate key, made from the product id and the date the price started. The window function lead looks one row ahead, at the next price's start date, and makes it this version's end: each version ends exactly where the next begins, and the current version gets an end date in the year nine nine nine nine, so that it is never in the past. Look at the side pane. The top contrasts the two sources of history: customers, where the source keeps only the present, so we snapshot it; and prices, where the source keeps a log, so we model it. The table underneath is the run's answer for products priced three ways in twenty twenty six: each version, its price, and the dates it was valid. With both dimensions versioned, the fact can now ask which version was valid when each order was placed.",
}
