import type { Section } from '../types'

export const answer: Section = {
  id: 'answer',
  title: "The first answer",
  scene: 'model-answer',
  narration:
    "In the first course, finance asked a simple question of the shop's database: revenue by category, by month. It took three joins over every line, on the server that takes the orders, and six hand written columns. This step asks the same question of the star. The editor shows the query, and it reads like the question: from the fact, join the date dimension for the month and the product dimension for the category, keep paid orders, and sum the amount. Snowflake's pivot clause then turns the six categories into six columns, which is what the shop's schema made us write by hand. The terminal shows the answer: twelve months, six categories. Look at the side pane. The star is lit along the path the query takes: the fact's date key, product key, status and amount, and the two dimensions they lead to. Under it, November, the busiest month, from both places: the shop database's answer in course one, read from that recording, and the star's answer, read from this one. They agree. That is the test of a dimensional model: it gives the same answers as the source, and it gives them from a shape built for the question, with short joins on keys, in a column store, on a warehouse of its own. But everything here was built by hand: if the data changed tomorrow, someone would have to run these scripts again, in the right order, and hope nothing broke. The next course rebuilds the star with d b t: repeatable, and tested.",
}
