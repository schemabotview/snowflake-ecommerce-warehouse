import type { Section } from '../types'

export const shopDb: Section = {
  id: 'shop-db',
  title: "Shopwave's database",
  scene: 'start-shop-db',
  narration:
    "Shopwave's warehouse starts where its data starts: the shop's own database. It runs on PostgreSQL, on this machine, holding the shop's whole year, twenty twenty six, from the same seeded generator as every other step. The explorer shows the two scripts that create it and load it, and the editor holds one query that asks each table how many rows it has and how much space it takes. The terminal shows four tables. Orders, one row per order, about twenty thousand of them at the scale this course uses. Order items, one row per line of an order. Customers, and products. Look at the side pane to see how they fit together. This is a normalised schema, the shape every shop database has. Each fact is stored once: an order points at its customer by the customer's id, and each order line points at its order and at its product by theirs. That is exactly right for taking orders, and it is why the first course's question needed three joins. The table underneath is the plan for these four tables: they will all be copied into Snowflake, into a database called raw, exactly as they are. Products go first, in this course, because they are small and change rarely; the rest arrive in course five, with the files from the payment provider, the website and the warehouse. The shop itself keeps running on PostgreSQL. The warehouse never replaces it, it only copies from it. Next, the places in Snowflake those copies will go.",
}
