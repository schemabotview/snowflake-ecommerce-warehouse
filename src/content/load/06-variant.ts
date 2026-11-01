import type { Section } from '../types'

export const variant: Section = {
  id: 'variant',
  title: "Semi-structured data",
  scene: 'load-variant',
  narration:
    "The website's click events are JSON, and JSON does not fit neatly into columns: events have different fields, nested objects, and lists of items. Snowflake's answer is a column type called variant, which holds a whole JSON document. The first command creates the clicks table with a single variant column, V, plus the file and load time, and copies every click file into it, through F F JSON, one row per event. Look at the side pane to see what that means. Each JSON line becomes one variant value. Snowflake does not store it as text: it splits the document's common paths into columns internally, so querying a path is nearly as fast as querying a real column. And no schema was declared for any of it. The editor queries it with paths. V colon event type reads that field, and V colon context dot device reaches into the nested context object. Each path is then cast, with two colons, to a string, because a variant value has no type until you give it one. The query counts January's events by type and device, and the table under the diagram is the run's answer: page views, product views, adds to cart, and the rest, on mobiles, desktops and tablets. Loading JSON into a variant is the raw layer's way of keeping a source exactly as it was sent, however it changes. And on the first of June, it did.",
}
