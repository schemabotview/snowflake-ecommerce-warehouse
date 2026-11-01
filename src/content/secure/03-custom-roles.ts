import type { Section } from '../types'

export const customRoles: Section = {
  id: 'custom-roles',
  title: "Custom roles",
  scene: 'secure-custom-roles',
  narration:
    "Shopwave has three teams that touch the warehouse, so it gets three roles, one for each. The editor creates them as user admin. Loader, for the data team, which brings the sources in. Transformer, for the analytics team, which builds the models with d b t. And analyst, for B I and finance, who read the results. Each role is then granted to sys admin, as security admin. That single step is easy to forget, and it matters: a custom role that is not granted to sys admin is an orphan, and whatever it creates, the administrators cannot see or manage. Look at the side pane to see the tree that makes. Sys admin at the top inherits all three team roles, which sit side by side, none above another. Then the roles go to people. Ravi gets analyst. Ana gets all three, so that she can test each one as she builds it: she is the one setting this up. The last statement asks Snowflake who holds the analyst role, and the table in the side pane is the answer from the run: sys admin, as a role, and the two users. None of these roles can do anything yet. A role is only a name until privileges are granted to it, and that is the next step: deciding, object by object, what each team may touch.",
}
