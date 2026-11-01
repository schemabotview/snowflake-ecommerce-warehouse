import type { Section } from '../types'

export const nightly: Section = {
  id: 'nightly',
  title: "Scheduling dbt",
  scene: 'operate-nightly',
  narration:
    "The task graph is in place, so this step runs tonight's job now, and reads what happened. The editor's script counts how many runs of the graph have finished, starts the root task with execute task, and then waits, checking every twenty seconds, until one more run has finished. A full build inside Snowflake takes a few minutes. Then it reads the record. The side pane shows the run. The snapshot task succeeded. The build task failed. That sounds bad, and it is exactly what should happen. The second table is what d b t itself said inside Snowflake, read from the run's log: two tests failed, the same two custom tests from course seven. One hundred and ninety one orders with no payment, and fifty five orders paid twice: the problems the data generator plants on purpose, still in the data, because nobody has fixed them at the source. And d b t's summary: twenty five nodes passed, two errors, and fifteen skipped. The first note explains the skips. When a test fails, d b t build does not build what depends on the data it tested, so those marts keep last night's rows instead of rows built on data known to be wrong. A failed task is the alarm working, which the second note says. The next morning, someone sees it, and the fix belongs at the source, not in the warehouse. Before changing anything to fix it, though, a developer needs somewhere safe to work, and Snowflake can make one in a second.",
}
