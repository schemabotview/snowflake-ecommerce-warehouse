import type { Section } from '../types'

export const sessions: Section = {
  id: 'sessions',
  title: "Sessions",
  scene: 'facts-sessions',
  narration:
    "The site tracker sends clicks, one row each, and marketing does not think in clicks. It thinks in visits: someone arrives, looks around, perhaps buys, and leaves. The clicks carry no visit id, so the warehouse has to find the visits itself. The usual rule, and the one used here, is a gap: if a visitor goes thirty minutes without a click, their next click starts a new session. The editor's model does it with window functions. The first block takes the staging clicks, names each visitor by customer id, or the anonymous id when they are not logged in, and uses lag to measure the minutes since that visitor's previous click. The second block marks every click that starts a session, the first one or one after a long gap, and a running sum over those marks numbers the sessions. The final select groups by visitor and session number, one row per visit, with when it started and ended, how many clicks it had, and whether it viewed a product, added to cart, checked out or bought. One line in the first block matters more than it looks: one anonymous id is excluded. Look at the side pane. The run counted the year's clicks, and that one id made about thirty thousand of them, eight percent, every one a page view. That is a scraper, not a shopper, and left in, its clicks would be counted as visits that never buy. Without it, the clicks become almost eighty thousand sessions, a little over four clicks each. Visits that view, cart and buy are a funnel.",
}
