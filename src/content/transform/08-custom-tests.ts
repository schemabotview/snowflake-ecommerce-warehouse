import type { Section } from '../types'

export const customTests: Section = {
  id: 'custom-tests',
  title: "Custom tests",
  scene: 'transform-custom-tests',
  narration:
    "Some rules belong to the business, not the model, and d b t lets you write those as custom tests: any select statement, saved in the tests folder, that returns the rows breaking the rule. The editor shows the first one. An order the shop marks as paid must have a payment: the query finds every paid order with no payment at all. The second test, beside it in the tests folder, says no order is paid twice. These are the two problems the data generator plants on purpose: about one percent of orders with no payment, and a few in a thousand paid twice, the same kind as order twenty two ninety three from the grain section. The terminal runs only these two tests, and both fail. This is a failure that is meant to happen, and it is worth reading. Look at the side pane. The table is the run's result: for each test, the number of rows it found, next to what the generator planted. Under it, what a failing test means in practice. In course twelve, a failing test stops the nightly build before bad data reaches a dashboard. Then someone has to decide: is this bad data, to be fixed where it was made, in the shop or the payment provider; or a fact of life the model must handle? For double payments, Shopwave already decided, in course six: the fact takes each order's first payment, so a double payment never doubles revenue. Unpaid orders go to finance. Next, writing all of this down where everyone can find it.",
}
