import type { Section } from '../types'

export const once: Section = {
  id: 'once',
  title: "A file loads once",
  scene: 'load-once',
  narration:
    "Loads get run twice. A schedule fires again after a failure, or someone reruns a script to be sure. So what does Snowflake do with the same copy into, run a second time? The editor runs exactly the orders load from the last section, then counts the table's rows and the distinct files they came from. The terminal shows the copy's answer: no files processed. And the count: the same orders, from the same three hundred and sixty five files, as before. Nothing was duplicated. Look at the side pane to see why. Every table keeps load metadata: for each file it has loaded, its name, its size and a checksum of its contents, kept for sixty four days. Before loading a file, copy checks that record. A file it has already loaded is skipped. So a load can safely be rerun, which is what makes a warehouse's loading dependable. The table at the bottom lists the cases where a file does load again. A file with the same name but new contents is a different file, and loads. Force equals true loads everything regardless, which duplicates rows, so it is for deliberate reloads only. And a file older than sixty four days, whose record has expired, is skipped by default, because Snowflake cannot be sure, unless you tell it to load uncertain files. Load metadata assumes the files themselves can be read, though, and the next source cannot be read so easily.",
}
