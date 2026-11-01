import type { Section } from '../types'

export const credits: Section = {
  id: 'credits',
  title: "Credits per model",
  scene: 'perform-credits',
  narration:
    "Every night d b t rebuilds the warehouse, and the bill for that arrives as credits on one warehouse. Which models are expensive? Snowflake cannot tell you directly, because it does not know what a model is. But every query can carry a label, called a query tag, and the editor's macro makes d b t set the tag to the model's name before it runs each model's queries. This is a pattern from d b t's own Snowflake documentation: a macro named set query tag replaces the built in one, and every model picks it up without a change. The first command runs the whole project, all twenty two models, on the analytics warehouse, now a small. Then the file reads that warehouse's query history from the last ten minutes, groups the queries by tag, and adds up their execution time. The side pane's table is the answer, from the run: the six models that took the most time, how many queries each ran, and each one's share of the total. No model dominates; the time is spread across the date dimension, the sessions, the lifecycle, the payments and the rest. That is what a warehouse this small looks like, and it is also what a healthy one looks like. The note explains why this is time and not credits. A warehouse is billed for every second it is running, with a minimum of a minute each time it resumes, not per query. So the fair way to split a run's bill is by each model's share of the time. When one model starts taking half, this query is how you will notice. The warehouse is fast and its costs are known. The next course serves it to its readers.",
}
