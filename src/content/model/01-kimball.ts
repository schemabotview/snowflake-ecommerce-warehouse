import type { Section } from '../types'

export const kimball: Section = {
  id: 'kimball',
  title: "Kimball's four steps",
  scene: 'model-kimball',
  narration:
    "Every source is now in raw, exactly as it arrived. Raw is honest, but it is shaped for the shop, not for the questions finance asks. So the warehouse needs a model built for those questions, and the most widely used way to design one comes from Ralph Kimball and Margy Ross, in The Data Warehouse Toolkit. This frame is their design process, drawn from the book, applied to Shopwave. Nothing is run here. It has four steps, in order. First, pick a business process: something the business does that produces events. For Shopwave, the first is selling: customers ordering products. Second, declare the grain: exactly what one row of the fact table means. Here, one order line, the most detailed record the shop keeps of a sale. Third, the dimensions: the ways people will slice those rows. When it happened, which customer, which product, and in what currency. Fourth, the facts: the numbers measured at that grain. The quantity, the unit price, and the amount in euros. The order matters more than anything else in the frame. The grain is chosen before any dimension or any fact, and every dimension and fact must then be true at that grain, exactly. A fact that is true per order, such as the delivery charge, does not belong on a table whose rows are order lines, because summing it would count it once per line. Choosing the grain is the one decision that is hard to undo, so it gets the next section to itself.",
}
