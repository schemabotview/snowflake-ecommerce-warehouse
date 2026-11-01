import type { Section } from '../types'

export const whatWeBuild: Section = {
  id: 'what-we-build',
  title: 'What we will build',
  scene: 'intro-what-we-build',
  narration:
    "This is the warehouse we will build, from an empty Snowflake account to the end of the course. On the left are Shopwave's sources: the shop database, a payment provider's daily Parquet files, the website's clicks as JSON, returns from the warehouse in an old encoding, and exchange rates for four currencies. In the middle is one Snowflake account, and the data flows through it left to right. Files land in a stage and load into the raw database exactly as they came, never edited. Staging models clean, rename and type them, and snapshots keep the history of customers and prices. The marts hold the dimensional model: a star with order lines at its centre, and more facts for the order lifecycle, returns, sessions and the funnel. And the B I layer holds one definition of revenue that every dashboard shares. Underneath runs everything that keeps it working: three warehouses that bill only while they run, under a monthly budget; roles that let each team in only as far as it needs, with key pairs for the services and policies that mask personal data; and d b t to build and test it all, tasks to run it every night, and a clone to change it safely. On the right are the readers: finance's dashboard, analysts with their own S Q L, and Brightline, the marketing agency, reading a secure share without a copy. Each course adds parts to this map. First, how Snowflake itself is built.",
}
