import type { Section } from '../types'

export const incremental: Section = {
  id: 'incremental',
  title: "An incremental fact",
  scene: 'transform-incremental',
  narration:
    "The fact table is rebuilt from scratch on every run. A year of order lines takes moments; ten years would not, and the nightly build would grow with every day of history. An incremental model rebuilds only what changed. The editor shows the fact's new first lines. Its materialisation is incremental, with a unique key, the order line key, and a merge strategy. And at the bottom, a block that applies only on incremental runs: keep only orders newer than the newest order already in the table. The terminal runs the model twice. The first run uses full refresh, which builds the whole table as if from scratch. The second is an ordinary run: d b t sees the table exists, applies the filter, and merges whatever new rows it finds, matching on the unique key, so a line that changed is updated and a new line is inserted. Look at the side pane to compare the two runs, with each run's result as d b t reported it. The full refresh created every order line. The next run had nothing newer than the newest order to merge, because no new orders have arrived since the load, so it merged nothing: that is the point. When tomorrow's orders are loaded, the next run reads only tomorrow. The cost is that the model must be correct about what is new. Orders that change after they are loaded, a status that moves from placed to paid, will not be picked up by this filter: course eight deals with that properly. Next, making sure the build is right, not just fast.",
}
