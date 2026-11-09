import type { Section } from '../types'

export const keys: Section = {
  id: 'keys',
  title: "Surrogate keys",
  scene: 'model-keys',
  narration:
    "So far the fact points at its dimensions with the shop's own ids: a customer id, a product id. Those are natural keys, and the warehouse does not control them. This step gives every dimension a key of its own, called a surrogate key. The customer and product dimensions are rebuilt first, each with a new first column: a key made by hashing the natural key. And the editor shows the fact rebuilt to point at those keys instead: it joins to each dimension on the shop's id and keeps only the dimension's key, plus a date key, which is the date written as a number. Look at the side pane. The star's edges now run from the fact's keys to each dimension's key. The table under it says why this is worth the trouble. A natural key is made by the shop, and if the shop ever renumbers its customers, or merges two systems, every join in the warehouse breaks. A surrogate key is made by the warehouse, so it never changes underneath you. And there is a deeper reason, which arrives in course eight. When a customer moves house, the warehouse will keep both versions of that customer, and each version needs a key of its own, so one customer id can have several customer keys. The last check, in the terminal, confirms that every fact row still finds its date, its customer and its product: no orphans. One more design choice remains before the first real answer: how far to normalise a dimension.",
}
