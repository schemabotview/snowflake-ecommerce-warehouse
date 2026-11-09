import type { Section } from '../types'

export const users: Section = {
  id: 'users',
  title: "Users and roles",
  scene: 'secure-users',
  narration:
    "So far everything has been done by Ana, the person who opened Shopwave's Snowflake account, as its administrator. A warehouse for a whole company needs more people than that, so this course decides who may do what, before any real data arrives. The first new person is Ravi, from the B I team. The editor creates his user. Notice which role creates it: user admin, the role whose job is users and roles, not the all-powerful account administrator. The terminal then asks three questions: who am I, which roles may I use, and which roles may Ravi use. Look at the side pane to see how Snowflake answers that. Privileges, such as using a warehouse or reading a table, are never granted to people. They are granted to roles, and roles are granted to users. A user can hold several roles but works as one at a time, the active role, and switches with use role. The table under the diagram is the run's answer, one column each. Ana can use every system role, because she created the account. Ravi has only public, the role every user gets, which by design can do almost nothing. That is the right place for a new user to start: with nothing, until a role is granted. Granting to roles rather than people is what makes a team manageable: when Ravi changes jobs, one grant changes, not fifty. Before creating roles of our own, though, we need to know the five that every account already has.",
}
