import type { Section } from '../types'

export const factless: Section = {
  id: 'factless',
  title: "A factless fact",
  scene: 'facts-factless',
  narration:
    "Marketing ran four campaigns in twenty twenty six, and the question it asks is not only who bought through each one. It is also who could have, and did not. A sales fact cannot answer that, because it only holds what happened. What is needed is a table of what could have happened, and Kimball calls it a factless fact: a row with no measure, where the row itself is the fact. The step loads the campaign calendar first: one J S O N file, an array of four campaigns, each with its start and end date. The loader's status line shows the four rows loaded. Then the editor's model, F C T eligibility. It says a customer was eligible for a campaign if they visited the site while it ran, taking the visits from the session fact. The result is one row per campaign and customer, and nothing else: no amount, no count. Look at the side pane. The query counts, for each campaign, the eligible customers, and how many of them had a visit through that campaign that ended in a purchase. The last column is the difference, and it is the column this table exists for. The newsletter reached all two thousand customers, and a little under two thirds bought through it. Black Friday reached fewer, and only about one in nine of them bought through it, though every one of the rest visited while it ran. A count of what did not happen can only come from a table of what could have. That completes the facts. The warehouse is now complete enough to be slow, and the next course makes it fast and cheap.",
}
