import type { Section } from '../types'

export const formats: Section = {
  id: 'formats',
  title: "File formats",
  scene: 'load-formats',
  narration:
    "Every sender writes files its own way, so before loading, Shopwave writes down how to read each kind, once, as a named file format. The editor creates four. F F C S V reads the shop's exports: comma separated, a header row to skip, text optionally in double quotes, and an empty field meaning null. F F C S V latin one is the same, but in the old Latin one encoding the returns warehouse still uses; this course's eighth section is about why that matters. F F JSON reads the site tracker's events, one JSON object per line. And F F parquet reads the payment provider's files, which carry their own column names and types. Look at the side pane to see the four as a contract: each format, what it reads, and who sends it. If a sender changes how it writes, the contract changes in one place, and every load that names it follows. The second command shows something useful about stages: you can query a staged file before loading it. It reads Black Friday's order export directly from the stage, through F F C S V, and picks out four of its columns by position, dollar one for the first, and so on. The table in the side pane is what came back: real rows, still in a file, never loaded. That is the cheapest way to check a format before trusting it with a whole year. Now the formats can be put to work.",
}
