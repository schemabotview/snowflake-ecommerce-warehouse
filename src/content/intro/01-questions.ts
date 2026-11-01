import type { Section } from '../types'

export const questions: Section = {
  id: 'questions',
  title: 'Questions the shop database cannot answer',
  scene: 'intro-questions',
  narration:
    "Shopwave is an online store, and every order it takes lands in one place: the shop's PostgreSQL database. The explorer shows that database's schema and the script that loads Shopwave's year into it, all twenty twenty six, from a seeded generator, so every number on screen is one a real run printed. Now the finance team asks a simple question: how much revenue did each category make, month by month? The editor holds the answer, in plain S Q L. Look at the side pane to see what that one question needs. A category lives on the product, a date and a status live on the order, and the money lives on the order line, so the query joins three tables by their keys, for every line of the year, and then groups them by month. It also has to spell out every category as its own column, because the shop's schema knows orders, not categories by month. The terminal shows the result, twelve months by six categories, and the chart at the bottom of the side pane adds each month up: November towers over the rest, because Black Friday is in it. It works. But this database was built for something else: taking one order at a time, inserting it, updating it, finding it by its key, quickly, while customers wait. A question over the whole year reads every line, and when every analyst asks one every month, they ask it on the same server that takes the orders. The next section looks at why the shape of the storage itself is the problem.",
}
