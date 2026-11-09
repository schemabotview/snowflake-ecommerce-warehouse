import type { Section } from '../types'

export const streams: Section = {
  id: 'streams',
  title: "Streams",
  scene: 'history-streams',
  narration:
    "The shop's database also sends a change feed: every time an order moves on, shipped or delivered, a change record. Snowflake can track changes to a table with a stream, and this step uses one on that feed. The first command lets the loader create streams, a privilege course four did not grant. Then the editor's file, as the loader, creates the change table, and a stream on it, before any data arrives. It loads the first week of December's change files, and the summary shows how many. Look at the side pane. A stream is not a copy of the table. It is an offset: a bookmark saying how far a reader has got, and when you select from it, you see every row that changed since that bookmark, with a column saying how it changed. The file reads the stream and the first table in the side pane is the run's answer: the new rows, all inserts, counted by the status they moved to. Then it consumes the stream. Any insert, update or merge that reads from a stream, and commits, moves its offset forward to now. The file inserts the stream's rows into a table of the latest statuses, and then counts the stream again: the diagram's last step shows what was left. Nothing, because everything has been consumed. Tomorrow's load will put tomorrow's changes in the stream, and only those. That is change capture inside the warehouse, without a timestamp filter to get wrong. One more way to keep things fresh remains: dynamic tables.",
}
