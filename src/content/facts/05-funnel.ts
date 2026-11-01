import type { Section } from '../types'

export const funnel: Section = {
  id: 'funnel',
  title: "The funnel",
  scene: 'facts-funnel',
  narration:
    "Marketing's favourite chart is the funnel: of all the visits, how many looked at a product, how many added something to the cart, how many checked out, and how many bought. F C T funnel is the session fact grouped by day, one row per day with a count for each step, so the chart can be drawn for any week or month. The editor's first query adds up the whole year. Look at the side pane, where those numbers are drawn as the funnel. Almost every visit viewed a product. About three in five added to the cart. Then the big drop: only about a quarter of visits reached checkout. And at the end, about a quarter of all visits bought: twenty four point nine percent. But read the last two steps carefully. More visits purchased than checked out. On this site every purchase comes after a checkout, so a funnel can only narrow, and here it widens, by two. The editor's second query asks which visits bought without checking out, and the second table is its answer: three sessions, each a single click, each a purchase a minute after midnight. The rest of each of those visits, its checkout included, is not in the warehouse. The likeliest explanation is that those earlier clicks were stamped on the previous day, and that day's files never carried them. Three visits in eighty thousand changes no decision, but a funnel that widens is always a question about the data, and a check worth keeping. Funnels count events. The next fact counts the state of things at fixed times.",
}
