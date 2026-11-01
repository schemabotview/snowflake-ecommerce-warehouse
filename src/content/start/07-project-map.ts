import type { Section } from '../types'

export const projectMap: Section = {
  id: 'project-map',
  title: 'The project map',
  scene: 'start-project-map',
  narration:
    "Here is the warehouse's map again, now with what Course 3 built lit up, and everything still to come greyed out in the place it will go. On the left, the shop database is lit: it is the one source connected so far. In the middle, inside the Snowflake account, the raw database holds its first table, and under it, W H LOAD, which costs only while it works, runs, under R M monthly's budget. The strip at the bottom names what this course made, in the order it made it: the shop's database with its four tables; the two databases, raw and analytics, with their five schemas; the products table, loaded by hand through its own stage; the warehouse, extra small and asleep after a minute; and the monitor that stops it at fifty credits a month. On the right, two honest gaps. Everything so far was done as the account's administrator, the role that can do anything, which is fine for one person on day one and wrong for a company with three teams. And only one table was loaded, by hand, from one export. A warehouse needs every source, loaded the same way every time. Those are the next two courses, in that order, because who may load data has to be settled before any data arrives. Course four gives each team a role of its own, and lets each one exactly as far as it needs to go.",
}
