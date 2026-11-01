import type { Section } from '../types'

export const warehouse: Section = {
  id: 'warehouse',
  title: 'Virtual warehouses and credits',
  scene: 'how-warehouse',
  narration:
    "Shopwave's first warehouse is for loading data, so it is called W H underscore LOAD. The editor creates it with four settings, and each one is about money. The size is extra small, the smallest there is. Auto suspend is sixty seconds: after a minute with nothing to do, it stops. Auto resume is on, so the next query that needs it starts it again. And it is created suspended, so it costs nothing until someone uses it. The terminal runs the file, then a second one that sets W H LOAD as the session's warehouse, shows its state, runs a query that really computes, a sum over a sample table, and shows its state again. Look at the side pane to follow that. A warehouse spends its life suspended, costing nothing. A query arrives, it resumes, and billing starts, per second, with a sixty second minimum every time it starts. When the work is done it stays up for its auto suspend time, and that idle minute is billed too, then it suspends again. What it costs per second is set by its size. Snowflake bills in credits, and an extra small warehouse uses one credit per hour of running. Every size up doubles the servers and doubles the rate: small is two, medium four, large eight. Twice the size often finishes in half the time, so a bigger warehouse is not always a dearer one. Before we choose sizes, though, we need to see what a warehouse actually reads.",
}
