import type { Section } from '../types'

export const rowAccess: Section = {
  id: 'row-access',
  title: "Row access policies",
  scene: 'serve-row-access',
  narration:
    "Shopwave has country managers, and the German manager should see German customers, not French ones. That is not a different table for each country; it is the same table, filtered by who is asking, and Snowflake does it with a row access policy. The first command creates the role, region manager, with everything an analyst can read, and lets the analytics team create row access policies. The editor's file starts with a small mapping table, region countries, which says which countries each role may see. Here, region manager sees Germany and Austria. Keeping this as data matters: a manager for France would be one more row, not a new policy. Then the policy, by region. It returns true, meaning the row is visible, if the session is working as the transformer or the analyst, or if the mapping table pairs the session's role with the row's country. d b t rebuilds the customer dimension, and the model's post hook now attaches both policies. The query counts customers by country twice, and the side pane shows both answers, from the run. As the transformer: Germany, then France, Britain and Italy, the whole table. As the region manager, with nothing else switched on: Germany and Austria, and nothing else. No error, no warning, the other rows simply do not exist for that role. Notice Austria has sixty eight customers: customer eighty one, who moved there from Spain, is among them, through the customer's second version. Next, a view that hides not rows, but how it is built.",
}
