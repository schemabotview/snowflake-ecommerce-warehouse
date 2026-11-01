import type { Section } from '../types'

export const dag: Section = {
  id: 'dag',
  title: "ref() and the DAG",
  scene: 'transform-dag',
  narration:
    "Nobody told d b t what order to build the models in. It works it out from the models themselves, and this step shows how. This one runs on this machine, with no connection to Snowflake at all. The terminal runs d b t parse, which reads every file in the project, finds every source and every ref, and writes a manifest: a complete description of the project. Then a short Python script reads that manifest and prints each model, how it is materialised, and the models it depends on. Everything drawn in this frame comes from that output. Look at the graph. On the left, the eight raw tables, which the staging models read with source. Next, the eight staging models. Then the marts: the customer and product dimensions, each reading one staging model; the date dimension, which reads nothing because it generates its own days; and the first payment model, which is ephemeral, more on that in a moment. And on the right, the fact, which refers to five models. This is a directed acyclic graph, a DAG: every arrow points one way, and there are no loops. Because every reference is written as ref, d b t knows that staging orders must exist before the fact, and builds everything in an order that respects every arrow, running independent models in parallel. Change one model, and d b t knows exactly which models downstream depend on it. The DAG is also what the documentation draws, at the end of this course. First, what each model actually becomes in Snowflake.",
}
