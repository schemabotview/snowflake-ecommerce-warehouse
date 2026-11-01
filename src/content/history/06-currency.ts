import type { Section } from '../types'

export const currency: Section = {
  id: 'currency',
  title: "Currency",
  scene: 'history-currency',
  narration:
    "Shopwave's prices are in euros, but its customers pay in four currencies: euros, pounds, dollars and rupees. The payments arrive in whatever currency each customer paid. And a sum of numbers in different currencies is not a number at all. This step adds the last dimension of the star, and a fact for payments. The currency dimension is small: four currencies, their names, and which one is the reporting currency, euros. The editor shows the payments fact: one row per payment, with its amount in its own currency, and the same amount in euros, divided by that day's exchange rate from the rates loaded in course five. Look at the side pane. The star now has all four dimensions, the currency dimension in its place at the bottom right, used by the payments fact. The table under it is the run's answer: payments by currency, with the amount in the currency's own units and in euros, and a total row at the bottom. Read the total row's amount column carefully: it adds pounds to rupees to dollars, and means nothing at all, even though the database computed it without complaint. The euro column's total is the only one that can be summed. That is the rule in the note, and one of the warehouse's invariants: revenue is reported in euros, through the currency dimension, and amounts in different currencies are never added together. Next, a way to see changes as they happen, inside Snowflake.",
}
