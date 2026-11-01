import type { Section } from '../types'

export const grain: Section = {
  id: 'grain',
  title: "The grain",
  scene: 'model-grain',
  narration:
    "What does one row mean? This step answers it with one real order, number twenty two ninety three: a German customer, three lines, and, because of a glitch the data generator plants on purpose, paid twice. First the terminal creates the analytics team's own warehouse, W H transform, puts it under the budget, and lets the transformer role use it. Then, working as the transformer, it counts that one order three ways. Look at the left of the frame. At one row per order, there is one row, with the order's total, and nothing about which products were in it: too coarse to answer anything by product. At one row per order line, there are three rows, each with its product, quantity and price, and their amounts add up to the order's total: that is the grain Shopwave chooses. The third way is the trap. Join the order lines to the payments, and each line appears once per payment. This order was paid twice, so there are six rows, and the revenue doubles. The table under the three is the run's answer for each, and the doubled number sits right next to the true one. Nothing failed, no error appeared: the sum was simply wrong. That is why the rule at the bottom matters. Choose the most detailed grain the source records, and never join a fact to anything that has more than one row per key, unless you have collapsed it to one first. Next, one sales process is not the whole business.",
}
