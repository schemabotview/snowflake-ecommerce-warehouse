import type { Section } from '../types'

export const databases: Section = {
  id: 'databases',
  title: 'Databases and schemas',
  scene: 'start-databases',
  narration:
    "Everything in Snowflake lives in a database, and every database is divided into schemas. The editor creates the two databases Shopwave's warehouse will use, and the names say what each is for. Raw holds the sources exactly as they arrive, never edited, so that anything built later can always be rebuilt from it. It has one schema, Shopwave, for the shop's data. Analytics holds what we make of it, in three schemas that match the layers of the warehouse: staging, for cleaned and renamed copies of each source; marts, for the dimensional model; and B I, for what dashboards read. Snowflake creates a schema called public in every new database; the file drops both, so nothing ends up somewhere nobody meant. Look at the side pane to see the hierarchy. The account holds databases, a database holds schemas, and a schema holds the objects: tables, views, stages, file formats, and more. Every object has a three part name, database, schema, object, like raw dot Shopwave dot products, so a query can say exactly what it means, from any database. The last statement in the file asks Snowflake for every schema in the two new databases, and the terminal shows the answer. None of this needed a warehouse: creating a database or a schema is metadata, handled by cloud services, and costs nothing until data arrives. A database with nothing in it teaches nothing, though, so next we load a first table.",
}
