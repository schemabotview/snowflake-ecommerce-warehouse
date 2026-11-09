import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { rowsOf } from '../recorded'
import { operateTree } from './tree'
import session from '../../../spine/operate/06-usage/session.txt?raw'
import sql from '../../../spine/operate/06-usage/project/ops/usage.sql?raw'

// §12.6 — Usage views (recorded on Snowflake, the next morning: ACCOUNT_USAGE runs hours behind).
// Credits are volatile: the frame reads them, the narration never states one.
const credits = rowsOf(session, 'WAREHOUSE', 2, 0, 3)
const failed = rowsOf(session, 'NAME', 2, 0, 1)
const logins = rowsOf(session, 'WHO', 4, 0, 5)

export const operateUsage: SceneModel = ideFrame2({
  model: 'The morning check: ACCOUNT_USAGE',
  tree: operateTree('ops/usage.sql', 'ops/usage.sql'),
  editor: { file: 'ops/usage.sql', code: sql },
  session,
  keep: [['| WH_TRANSFORM', '| WH_BI'], '| NIGHTLY_BUILD', ['| WHO', '| SVC_DBT']],
  side: [
    {
      type: 'group', id: 'where', bare: true, dir: 'row', children: [
        { type: 'item', id: 'u-is', icon: 'database', title: 'INFORMATION_SCHEMA', sub: 'now, one database, days', stack: true, muted: true },
        { type: 'item', id: 'u-au', icon: 'clock', title: 'ACCOUNT_USAGE', sub: 'hours late, the account, a year', stack: true, tone: 'serve' },
      ],
    },
    { type: 'table', id: 'c', title: 'Credits by warehouse (from the run)', columns: ['warehouse', 'credits'], rows: credits },
    { type: 'table', id: 'f', title: 'Failed tasks', columns: ['task', 'failures'], rows: failed, tone: 'consume' },
    { type: 'table', id: 'l', title: 'Sign-ins', columns: ['who', 'how', 'ok', 'failed'], rows: logins },
  ],
  edges: [
    { from: 'u-au', to: 'c' },
    { from: 'c', to: 'f' },
  ],
})
