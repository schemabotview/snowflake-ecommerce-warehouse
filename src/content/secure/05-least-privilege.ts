import type { Section } from '../types'

export const leastPrivilege: Section = {
  id: 'least-privilege',
  title: "Least privilege",
  scene: 'secure-least-privilege',
  narration:
    "Least privilege means every role holds exactly what its job needs, and nothing more. The side pane shows the whole of the last step's file as one table: three roles across the top, the warehouses and schemas down the side, and in each cell what that role may do there. Read it by column. The loader uses its own warehouse and reads and writes raw, and that is all: it cannot see a single model. The transformer reads raw and builds in all three analytics schemas. The analyst uses the B I warehouse and reads marts and B I: it cannot see raw, and it cannot change anything. Underneath, the same thing as a flow: data moves one way, from raw, through analytics, to the marts and B I, and the privileges follow it. Each team can write only where it is responsible, and can read only what it needs. The editor asks Snowflake for its own account of two of those roles, and the terminal lists every grant each one holds, which is how you check that what was intended is what was applied. The payoff is containment. If the loader's key leaked, the damage is limited to writing into raw, which the next layer would reject in its tests, and nothing it could do reads a single customer's spending. A matrix is a promise, though, so the next step tests it, the way an analyst would, by accident.",
}
