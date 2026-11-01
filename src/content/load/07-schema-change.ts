import type { Section } from '../types'

export const schemaChange: Section = {
  id: 'schema-change',
  title: "The June 1 schema change",
  scene: 'load-schema-change',
  narration:
    "On the first of June, the website's tracker changed what it sends. The device field moved: context dot device became context dot device type. And a new field appeared, consent, recording whether the visitor allowed tracking. Nobody told the data team. The first command asks Snowflake to infer the schema of the click files on either side of the change, the thirty first of May and the first of June, and compares the top level fields; the consent field shows up only in June. Look at the side pane to see the change on one event. On the left, May's shape; on the right, June's, with the renamed field and the new one highlighted. Because the clicks were loaded into a variant column, nothing broke: the load in the last section took both shapes without a single error. A table with a fixed column for device would have loaded June's events with that column empty, silently. The editor's query reads across both shapes. For May and June it counts, per month, how many events have the old field, how many have the new one, how many have either, using coalesce, and how many carry consent. The table in the middle is the run's answer: May has only the old field, June only the new, and either one covers both months completely. Notice where this is fixed. Raw keeps both shapes exactly as they were sent, and giving the device one name is staging's job, in course seven. Now the returns, and their encoding.",
}
