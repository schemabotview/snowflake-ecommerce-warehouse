import type { Section } from '../types'

export const sizing: Section = {
  id: 'sizing',
  title: 'Sizing and auto-suspend',
  scene: 'start-sizing',
  narration:
    "How big should a warehouse be? This step measures it. The editor runs one query twice over a large sample table, six hundred million order lines, first on W H LOAD at extra small, then again after resizing it to small. The result cache is switched off for the session, so each run really reads the data, and each run is tagged, so the last query can find both in the session's query history and show how long each took. Look at the side pane. The table compares the two runs: small costs two credits an hour instead of one, and the elapsed times say what that bought. When a query reads a lot of data, doubling the warehouse often roughly halves the time, which means it costs about the same and answers sooner. When a query is small, a bigger warehouse just costs more. Times vary from run to run, so the numbers on screen are this run's, not a promise. The file puts the warehouse back to extra small, because that is what loading needs. Then the terminal does something unusual: it waits. It shows the warehouse's state, sleeps for a minute and a half, and shows it again. The diagram follows the warehouse through the step: resumed for the first query, resized and resized back, then idle for its sixty second auto suspend, and finally suspended by itself, costing nothing. Auto suspend is the setting that saves the most money. But it stops nobody from spending: for that, the warehouse needs a budget.",
}
