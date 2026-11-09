import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf } from '../ide'
import { ideFrame2 } from '../frame'
import { cell } from '../recorded'
import { factsTree } from './tree'
import session from '../../../spine/facts/04-sessions/session.txt?raw'
import sql from '../../../spine/facts/04-sessions/project/dbt/models/marts/fct_sessions.sql?raw'

// §9.4 — Sessions: clicks cut into visits at every gap of 30 minutes, the scraper left out
// (recorded on Snowflake).
const n = (column: string) => cell(session, column)
const share = Number.isNaN(Number(n('CLICKS'))) ? '…' : `${Math.round((100 * Number(n('BOT_CLICKS'))) / Number(n('CLICKS')))}%`

export const factsSessions: SceneModel = ideFrame2({
  model: 'Sessions: clicks cut into visits at a 30-minute gap',
  tree: factsTree('queries/sessions.sql', 'dbt/models/marts/fct_sessions.sql', ['dbt/models/marts/fct_sessions.sql', 'queries/sessions.sql']),
  editor: { file: 'dbt/models/marts/fct_sessions.sql', code: sql, show: [[lineOf(sql, 'with clicks as'), lineOf(sql, 'from clicks') + 1], [lineOf(sql, "'product_view'"), lineOf(sql, "'purchase'")]] },
  session,
  keep: ['$ dbt run --select fct_sessions', '1 of 1 OK created sql table model MARTS.fct_sessions', 'Done. PASS=1', '$ bash model/as-transformer.sh -f queries/sessions.sql', ['| CLICKS', '| 376285']],
  side: [
    {
      type: 'group', id: 'how', badge: 1, title: 'From clicks to visits', tone: 'infra', children: [
        { type: 'item', id: 's-sort', icon: 'clock', title: 'One visitor’s clicks, in time order', sub: 'LAG(): minutes since the last one' },
        { type: 'item', id: 's-cut', icon: 'filter', title: 'A gap of 30 minutes or more', sub: 'starts a new session' },
        { type: 'item', id: 's-num', icon: 'layers', title: 'A running SUM of the starts', sub: 'numbers each session' },
        { type: 'item', id: 's-row', icon: 'table', title: 'One row per session', sub: 'what the visit viewed, carted, bought' },
      ],
    },
    {
      type: 'group', id: 'seen', badge: 2, title: 'The year’s clicks', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'c', columns: ['clicks', 'the bot’s', 'sessions', 'clicks each'], rows: [[n('CLICKS'), `${n('BOT_CLICKS')} (${share})`, n('SESSIONS'), n('EVENTS_PER_SESSION')]] },
      ],
    },
  ],
  edges: [
    { from: 's-sort', to: 's-cut' },
    { from: 's-cut', to: 's-num' },
    { from: 's-num', to: 's-row' },
  ],
})
