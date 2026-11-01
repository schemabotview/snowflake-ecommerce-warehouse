import type { Section } from '../types'

export const editions: Section = {
  id: 'editions',
  title: 'Editions',
  scene: 'how-editions',
  narration:
    "Snowflake comes in editions, and each one includes everything in the one before it. This frame is drawn from Snowflake's documentation, not from a run. Standard is the base: virtual warehouses, resource monitors to cap spending, network policies and single sign on, and time travel that can look back one day. Shopwave's warehouse uses all of these. Enterprise adds what makes a warehouse fast at scale and safe to share. Multi cluster warehouses, which add clusters when too many people query at once, used in course ten for Black Friday. Materialised views, search optimisation and query acceleration, three more ways to make queries faster, also in course ten. Masking policies and row access policies, which decide what each reader sees, column by column and row by row, in course eleven. And time travel up to ninety days. The tinted features are the ones this course uses, which is why the trial behind it is an Enterprise account. Business Critical adds what regulated companies need: encryption with a key the customer holds, called Tri Secret Secure, private network connections to Snowflake, failover between accounts in different regions, and support for health data. And Virtual Private Snowflake gives a company its own metadata store and compute, sharing no hardware with any other account. Editions change the price of a credit, not how credits are counted, so everything we learn about cost holds in every edition. Next, the different ways to reach the same service.",
}
