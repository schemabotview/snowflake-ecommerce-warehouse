import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { rowsOf } from '../recorded'
import { operateTree } from './tree'
import session from '../../../spine/operate/06-usage/session.txt?raw'
import sql from '../../../spine/operate/06-usage/project/ops/usage.sql?raw'

// §12.6 — Usage views (recorded on Snowflake, the next morning: ACCOUNT_USAGE runs hours behind).
// Credits are volatile: the frame reads them, the narration never states one.
const credits = rowsOf(session, 'WAREHOUSE', 2, 0, 6)
const failed = rowsOf(session, 'NAME', 2, 0, 1)
const logins = rowsOf(session, 'WHO', 4, 0, 3)

export const operateUsage: SceneModel = ideFrame({
  tree: operateTree('ops/usage.sql', 'ops/usage.sql'),
  editor: { file: 'ops/usage.sql', code: sql },
  session,
  side: [
    {
      type: 'group', id: 'views', badge: 1, title: 'SNOWFLAKE.ACCOUNT_USAGE', sub: 'a year of history, a few hours behind', tone: 'infra', dir: 'row', children: [
        { type: 'table', id: 'c', title: 'credits by warehouse', columns: ['warehouse', 'credits'], rows: credits },
        { type: 'table', id: 'l', title: 'sign-ins', columns: ['who', 'how', 'ok', 'failed'], rows: logins },
      ],
    },
    {
      type: 'group', id: 'tasks', badge: 2, title: 'Failed tasks', sub: 'from the run', tone: 'consume', children: [
        { type: 'table', id: 'f', columns: ['task', 'failures'], rows: failed },
      ],
    },
    { type: 'note', id: 'is', tone: 'neutral', text: 'INFORMATION_SCHEMA answers now, for one database, for days. ACCOUNT_USAGE answers for the whole account, for a year, hours later: the place for a morning check.' },
  ],
  edges: [],
})
