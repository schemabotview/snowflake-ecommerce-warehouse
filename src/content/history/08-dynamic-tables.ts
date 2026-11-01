import type { Section } from '../types'

export const dynamicTables: Section = {
  id: 'dynamic-tables',
  title: "Dynamic tables vs dbt incremental",
  scene: 'history-dynamic',
  narration:
    "Course seven kept the fact table fresh with a d b t incremental model, run on a schedule. Snowflake has its own way to do the same job: a dynamic table. The first command grants the analytics team the right to create them. The editor creates one: daily revenue, defined as an ordinary select over the fact and the date dimension, with a target lag of one hour and a warehouse to refresh it with. From then on Snowflake keeps it no more than an hour behind its sources, by itself: it notices what changed upstream and refreshes only what it needs to. No schedule, no run command. The last statements show the dynamic table as Snowflake sees it, and then suspend it, because this is a demonstration and a dynamic table left running spends credits refreshing it. Look at the side pane to compare the two approaches. A d b t incremental model is run by a schedule, is as fresh as the last run, rebuilds what your filter says is new, and comes with tests, documentation and the lineage graph. A dynamic table is run by Snowflake, is as fresh as its target lag, works out what changed for itself, and is just the S Q L. The middle table is the run's own description of the one just made. Shopwave's choice is at the bottom. The star stays in d b t, tested every night. Small summaries that must be fresh can be either, and d b t can even build them as dynamic tables. With history in place, course nine adds every other kind of fact.",
}
