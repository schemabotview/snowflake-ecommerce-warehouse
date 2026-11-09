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
  model: 'TODO',
  tree: operateTree('ops/usage.sql', 'ops/usage.sql'),
  editor: { file: 'ops/usage.sql', code: sql },
  session,
  keep: [['| WH_TRANSFORM', '| WH_BI'], '| NIGHTLY_BUILD', ['| WHO', '| SVC_DBT']],
  side: [
    {
      type: 'group', id: 'cost', badge: 1, title: 'Credits by warehouse, since the trial opened', sub: 'from the run', tone: 'infra', children: [
        { type: 'table', id: 'c', columns: ['warehouse', 'credits'], rows: credits },
      ],
    },
    {
      type: 'group', id: 'tasks', badge: 2, title: 'Failed tasks', sub: 'from the run', tone: 'consume', children: [
        { type: 'table', id: 'f', columns: ['task', 'failures'], rows: failed },
      ],
    },
    {
      type: 'group', id: 'who', badge: 3, title: 'Sign-ins: Ana and the two service users', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'l', columns: ['who', 'how', 'ok', 'failed'], rows: logins },
      ],
    },
  ],
  edges: [],
})
