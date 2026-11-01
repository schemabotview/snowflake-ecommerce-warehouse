import type { Section } from '../types'

export const tasks: Section = {
  id: 'tasks',
  title: "Tasks",
  scene: 'operate-tasks',
  narration:
    "Everything so far has been run by hand. A warehouse has to rebuild itself every night, without anyone at a keyboard, and Snowflake runs scheduled work with tasks. A task is one S Q L statement, run on a schedule or after another task, and a set of tasks that follow one another is a task graph. Shopwave's files already arrive on their own through Snowpipe, from course five, so the nightly graph does the rest: snapshot the customers, then build and test the warehouse. That needs d b t, and d b t has so far run on this machine. The second command moves it into Snowflake: snow d b t deploy copies the project's files in and creates an object, shopwave d b t, that Snowflake itself can execute. The first command granted the rights for this, and the first note says why it matters: no server has to stay awake for the night. The editor's file creates the graph, drawn in the side pane. The root task, nightly snapshot, runs every night at two in the morning, Berlin time, and executes the project's snapshot. The child task, nightly build, runs after it and executes a full d b t build, every model and every test. The child is resumed; the root's schedule is deliberately left suspended, because a trial account should not rebuild itself every night. The table shows both tasks as Snowflake lists them. One more detail, in the second note: a task runs as the role that owns it, here the transformer, the one role the row access policy lets read every customer. Next, tonight's run, started by hand.",
}
