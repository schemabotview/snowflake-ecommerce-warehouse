import type { Section } from '../types'

export const cost: Section = {
  id: 'cost',
  title: 'What a query costs',
  scene: 'how-cost',
  narration:
    "Before Shopwave opens its warehouse, it wants to know what a day will cost, so this lab builds a model. To be clear about what it is: it applies Snowflake's published billing rules to a day Shopwave plans to have. It runs on this machine, and it proves nothing about Snowflake itself. The rules are written in the file's opening lines: credits per hour by size, per second billing with a sixty second minimum each time a warehouse starts, and auto suspend. The editor shows what comes after them. First the day: a nightly load, a d b t build after it, and a dashboard that refreshes every fifteen minutes through the working day, each refresh a three second query. Then the billing function, which walks the queries in order: a query that arrives while the warehouse is still up joins the same run; any other starts a new one, billed at least a minute. The terminal shows the result. The load and the build cost little, because they work for minutes at a time. The dashboard is the surprise. Its queries work for about two minutes in a whole day, yet it is billed for nearly an hour, because each three second query costs a resume, the sixty second minimum, and the idle minute before it suspends. The side pane draws one of those queries, and the table under it shows the day. With auto suspend at ten minutes, the same dashboard costs about ten times as much. A busy dashboard can share a warehouse that stays awake; a quiet one should be left to sleep. With that, the account can be opened.",
}
