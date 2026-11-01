import type { Section } from '../types'

export const stage: Section = {
  id: 'stage',
  title: "Stages",
  scene: 'load-stage',
  narration:
    "Shopwave's data arrives as files: the shop database's nightly exports, the payment provider's Parquet, the website's clicks, the returns warehouse's monthly C S V. Before Snowflake can load a file, the file has to be somewhere Snowflake can read, and that place is a stage. From this course on, every load runs as the loader, so the explorer has a small script, as loader, that calls snow with the loader's own service user, its private key, its role and its warehouse. The first command creates the stage: raw dot Shopwave dot landing, an internal stage, meaning Snowflake stores the files itself, with a directory table switched on so the stage can be queried like a list. The editor's script uploads everything the generator wrote for twenty twenty six, keeping each source in its own folder. That is about ten thousand files, most of them hourly click files, so the script writes the long list of uploads to a log, prints a summary, and asks Snowflake to refresh the stage's directory. Look at the side pane to see the path a file takes. From a folder on this machine, through put, onto the stage, where it waits, still a file. Loading it into a table is a separate step, next. The table under the path is the directory table, grouped by source folder, as the run returned it: how many files landed and how big they are. A stage can also be external, pointing at a cloud bucket a sender writes to directly. Next: telling Snowflake how to read each kind of file.",
}
