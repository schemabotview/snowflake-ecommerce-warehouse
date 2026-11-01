import type { Section } from '../types'

export const refused: Section = {
  id: 'refused',
  title: "A refused query",
  scene: 'secure-refused',
  narration:
    "Ravi has spotted a product with the wrong price, and as an analyst he tries to fix it where he can see it, in raw. The editor holds his update, and the terminal runs it with the analyst role. Snowflake refuses, and the error is worth reading closely. It does not say permission denied. It says the database does not exist, or is not authorised. A role without access to an object cannot even learn that it is there, which is deliberate: the names of tables can themselves be sensitive. Look at the side pane to see where the request stopped. To run that update, the analyst needed usage on a warehouse, which it has; then usage on the raw database, which it was never granted, so the query stops there; and only then the update privilege on the table, which it never reached. Snowflake checks every link of the chain, from the outside in. The second command, run as the administrator, finds the missing grant: it lists who holds privileges on raw, and the analyst is not among them. So should we grant it? No. The refusal is the system working. Raw holds the sources exactly as they arrived, and a wrong price is fixed where it was made, in the shop's database, and loaded again. Editing raw by hand would break the one promise raw makes. The analysts have their roles; the programs that load and transform need users of their own, which is next.",
}
