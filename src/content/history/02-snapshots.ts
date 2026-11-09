import type { Section } from '../types'

export const snapshots: Section = {
  id: 'snapshots',
  title: "dbt snapshots",
  scene: 'history-snapshots',
  narration:
    "The shop's customers table keeps only the present: when customer eighty one moved, their row was simply updated. To keep the past, the warehouse has to notice each change, and a d b t snapshot does exactly that. The first command loads the shop's change log into raw and creates customer state, a table that stands in for the shop's live customers table. The editor's script then compresses a year of nights into thirteen: once at the start of the year, before anything changed, and then at the end of each month, it sets customer state to the shop's customers as they stood that day, and runs d b t snapshot. Look at the side pane. Each time the snapshot runs, it compares customer state with what it has already recorded. For a customer whose updated at has moved, it closes the old row, setting its valid to, and adds a new row, valid from the change. Everything else is left alone. The table underneath is the snapshot's record of customer eighty one, from the run: one row per version, with the dates each was valid. There is a catch, on the card at the bottom. A snapshot can only keep what it sees. If a customer changed twice between two runs, the snapshot records one version, the second, and the first is lost for good. That is why snapshots run every night, and why, when a source keeps its own history, it is better to use that history directly, which is the next section.",
}
