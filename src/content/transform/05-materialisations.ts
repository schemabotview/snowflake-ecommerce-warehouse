import type { Section } from '../types'

export const materialisations: Section = {
  id: 'materialisations',
  title: "Materialisations",
  scene: 'transform-materialisations',
  narration:
    "Every d b t model is a select statement. What it becomes in Snowflake is its materialisation, and this step builds the marts and looks. The editor shows the smallest model in the project, first payment: an order's earliest payment time. Its first line sets its materialisation to ephemeral. The terminal runs d b t run on the marts, then asks Snowflake's information schema what the staging and marts schemas now hold. Look at the side pane. The table at the top is the four materialisations. A view stores only the query, and computes it every time someone reads it: cheap to build, and right for staging, which is read only by the next model. A table stores the result, recomputed on every d b t run: right for marts, which many people read many times. An ephemeral model builds nothing at all: d b t pastes it into every model that refers to it, as a common table expression, which keeps small helper logic in its own file without cluttering the warehouse. And incremental, which is next. The second table is Snowflake's answer, from the run: the staging models listed as views, the dimensions and the fact as tables, and no first payment anywhere, because it was never built. That is how you check that what d b t was told is what Snowflake did. The fact, though, is rebuilt in full every run, and a year from now that will be a lot of rows to rebuild every night.",
}
