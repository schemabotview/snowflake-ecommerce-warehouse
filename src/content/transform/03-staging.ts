import type { Section } from '../types'

export const staging: Section = {
  id: 'staging',
  title: "Staging models",
  scene: 'transform-staging',
  narration:
    "The first models are staging: one for each raw table. The editor shows the most interesting one, staging clicks. Its source is the clicks table from course five, where every event is a single variant column. The model turns that into typed columns: the event's id, its time, its type, the customer, and so on. The device line is where the June schema change is finally settled: coalesce takes device type where it exists, and device where it does not, so from here on every event has one device column, whatever month it is from. And the last lines remove the tracker's duplicates. The data generator sends about one event in two hundred twice, and qualify keeps exactly one row for each event id, the first one loaded. Look at the side pane. The table pairs every raw table with its staging model, as d b t's own manifest records them: orders with staging orders, clicks with staging clicks, and so on. One source, one staging model. The others are simpler than clicks: they rename columns into the warehouse's own names, like total becoming total in euros, and lower case the order status. Under the table, the three things staging clicks does, in order. The terminal runs d b t run, selecting only the staging folder, and d b t creates eight views in the staging schema, each one reported as it finishes. Views cost nothing to create, because a view stores only its query. Next, how d b t knew which order to build them in.",
}
