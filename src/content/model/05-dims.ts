import type { Section } from '../types'

export const dims: Section = {
  id: 'dims',
  title: "Dimensions",
  scene: 'model-dims',
  narration:
    "Dimensions are what make a fact readable: they turn a product id into a name, a brand and a category. This step builds three. The editor shows the most interesting one, the date dimension, because no source sends it: the warehouse makes it. It generates one row for every day of twenty twenty six, three hundred and sixty five of them, and gives each day every attribute a report might group by: its day name, whether it falls on a weekend, its month, quarter and year, and a flag for Black Friday. A report that wants weekends versus weekdays now reads a column instead of computing it. The other two are built from raw. The customer dimension holds each customer's country, the currency they pay in, when they signed up, and their email, which course eleven will mask. The product dimension holds each product's name, brand, category and list price. Look at the side pane: the star now has three dimensions, joined to the fact's three pointers. The table underneath is the check from the last command: each dimension's row count and its number of distinct keys, which must be equal, because a dimension with two rows for one key would double every fact that joins to it, exactly the trap from the grain section. Notice the shape the frame makes. Dimensions are short and wide: a few thousand rows, many descriptive columns. Facts are long and narrow: many rows, a few keys and numbers. Next, a problem with those keys.",
}
