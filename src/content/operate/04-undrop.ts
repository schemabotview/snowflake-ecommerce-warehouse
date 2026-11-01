import type { Section } from '../types'

export const undrop: Section = {
  id: 'undrop',
  title: "Time travel and UNDROP",
  scene: 'operate-undrop',
  narration:
    "Sooner or later someone drops the wrong table. In Snowflake that is usually a minute's problem, not a disaster, because a dropped table is not deleted straight away. The side pane's diagram is a table's life after drop. For the retention period, one day on this account, it is in time travel: you can query it as it was at any moment, and bring it back with undrop. After that come seven days of fail safe, which only Snowflake support can recover from, and then it is gone, and no longer billed as storage. The editor's file acts it out on the cohort mart from course eleven. It counts the rows: seventy eight. It drops the table. Snowflake's table history still lists it, with the time it was dropped. Then undrop table, and the count is seventy eight again: the same table, with its rows, its grants and its policies, not a rebuilt one. The next query is time travel proper: the same table, as it was five minutes ago, using at with an offset, and the answer is seventy eight rows, from before the drop. The last query reads the retention setting: one day. The note adds that Enterprise edition allows up to ninety days, set per table, schema or database, and that longer history costs more storage, because every old version is kept. Clones and time travel together make change safe. The next step puts them to work for every pull request.",
}
