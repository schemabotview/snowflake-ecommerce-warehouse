import type { Section } from '../types'

export const snowflakeSchema: Section = {
  id: 'snowflake-schema',
  title: "Star vs snowflake schema",
  scene: 'model-snowflake-schema',
  narration:
    "Look at the product dimension. Fifty products, six categories, so each category's name is stored again and again, once per product. A database designer's instinct is to normalise that: move categories into a table of their own and point to it. A dimensional model built that way is called a snowflake schema, after its shape, which has nothing to do with the product we are using. This step builds both and asks them the same question. The terminal makes a category table and a product dimension that points to it, as temporary tables that vanish when the session ends, then sums revenue by category through each model. On the left, the star: category is just a column of the product dimension, one join away from the fact. On the right, the snowflake: product points to category, two joins away. The table under the diagrams is the run's answer from both, and the numbers are the same; only the path differs. The second table is the trade. The snowflake stores each category name once, and needs an extra join for every question about categories. The star repeats the name, and in a column store that repetition costs almost nothing: a column of six distinct values compresses to almost nothing. So in a warehouse, the star wins: fewer joins, simpler queries for every analyst, and the storage it seems to waste is not really used. Shopwave keeps its star. Next, two more kinds of dimension.",
}
