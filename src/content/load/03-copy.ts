import type { Section } from '../types'

export const copy: Section = {
  id: 'copy',
  title: "COPY INTO",
  scene: 'load-copy',
  narration:
    "Copy into is how a stage becomes a table. The first command creates four tables in raw dot Shopwave, with the same columns as the shop's own, plus two more on every row: the file it came from, and when it was loaded. The editor shows the load itself. For orders, copy into reads every file in the stage's orders folder, through F F C S V, and writes each file's rows into the table. Instead of loading the columns blindly, it selects them, which lets it add the file name, from a special column called metadata dollar filename, and the current time. The arrow at the end of each copy sends its result, one row per file, into a small summary query, so the terminal shows one line per table instead of one per file. Look at the side pane to see the shape of a load. Three hundred and sixty five daily files on the stage. Copy into, run by the loader's warehouse, which reads many files in parallel. And the table, with every row's source file kept. The table under it is the run's summary: how many files and rows went into orders, order items, customers and exchange rates. Keeping the file name on every row costs almost nothing and pays off the first time a number looks wrong: you can trace any row back to the exact file, and the exact day, it arrived from. A question remains, though: what happens if this load runs twice?",
}
