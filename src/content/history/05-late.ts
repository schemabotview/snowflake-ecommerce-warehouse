import type { Section } from '../types'

export const late: Section = {
  id: 'late',
  title: "Late-arriving facts",
  scene: 'history-late',
  narration:
    "Every click event carries two dates, and usually they are the same. Look at the side pane. When it happened is the event's own time stamp, and it decides which day the click counts for. When it arrived is the day of the file it came in, and it decides when the warehouse learns about it. The website's tracker sometimes holds events back, so about one click in a hundred arrives up to three days late, a problem the data generator plants on purpose. The editor's query compares the two dates for every click in raw: the day it happened, against the day in its file's path, and counts the events by how many days late they were. The table in the side pane is the run's answer. Most arrive the same day; a few, one, two or three days late. A late fact must be counted in the day it happened, not the day it arrived. Staging does that already, because it uses the event's own time stamp. But it means a day's numbers can change after the day is over: Monday's sessions are not final until Thursday's files are in. Reports should say so, and incremental models must look back far enough to catch late rows, not just at today. There is a harder version, in the note at the bottom. A late fact can refer to a customer the dimension has not seen yet. Kimball's answer is an inferred member: a placeholder row for that customer, filled in when their details arrive. Next, money in four currencies.",
}
