import type { Section } from '../types'

export const snowpipe: Section = {
  id: 'snowpipe',
  title: "Snowpipe",
  scene: 'load-snowpipe',
  narration:
    "The payment provider drops a Parquet file every day, and loading daily files by hand does not scale, so payments get a pipe. A pipe is a copy into statement that Snowflake runs by itself, each time a new file arrives. The editor creates the payments table, then the pipe, which loads every file in the stage's payments folder through F F parquet, matching the file's column names to the table's, so the order of columns in the file does not matter. Look at the side pane to see the flow. A file lands on the stage. The pipe is told about it, runs its copy, and the rows arrive in the payments table. A pipe does not use a warehouse at all: it runs on compute Snowflake manages, billed separately, per file, so nothing has to stay awake waiting for files. The table at the bottom answers the obvious question: how is the pipe told? With an external stage, a bucket in the cloud, the bucket itself sends an event when a file arrives, and the pipe loads it within moments: that is called auto ingest, and it needs a cloud account this course does not have, so it is cited from the documentation, not run. With an internal stage, like ours, something must ask, and alter pipe refresh does: it makes the pipe look at the folder and queue every file it has not loaded yet. The terminal refreshes, waits two minutes, and checks the pipe's state and the table's rows. Every source is now in raw. Next, the model.",
}
