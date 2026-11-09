import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { cell } from '../recorded'
import { startTree } from './tree'
import session from '../../../spine/start/04-sizing/session.txt?raw'
import sql from '../../../spine/start/04-sizing/project/queries/sizing.sql?raw'

// §3.4 — Sizing and auto-suspend: one query on XS, then S, timed by QUERY_HISTORY; then the
// warehouse watched until it suspends itself (recorded on Snowflake; the times are volatile).
const ms = (row: number) => cell(session, 'ELAPSED_MS', row)
// state.sql runs twice: before and after `sleep 90`
const state = (n: number) => cell(session, 'state', 0, n)

export const startSizing: SceneModel = ideFrame2({
  model: 'TODO',
  tree: startTree('queries/state.sql', 'queries/sizing.sql', ['queries/sizing.sql', 'queries/state.sql']),
  editor: { file: 'queries/sizing.sql', code: sql },
  session,
  keep: ['$ snow sql -f queries/sizing.sql', ['| SIZE', '| S    | Small'], '$ sleep 90', ['| name', '| WH_LOAD | X-Small | SUSPENDED']],
  side: [
    {
      type: 'group', id: 'measured', badge: 1, title: 'One query, two sizes', sub: 'TPC-H SF100 LINEITEM, no result cache', tone: 'infra', children: [
        { type: 'table', id: 'times', columns: ['size', 'credits / hour', 'elapsed ms'], rows: [
          ['XS', '1', ms(0)], ['S', '2', ms(1)],
        ] },
      ],
    },
    {
      type: 'group', id: 'life', badge: 2, title: 'WH_LOAD through this step', sub: 'billed only while running', tone: 'neutral', children: [
        { type: 'item', id: 'l-xs', icon: 'cpu', title: 'Resumes as XS', sub: 'the first query' },
        { type: 'item', id: 'l-s', icon: 'cpu', title: 'Resized to S, back to XS', sub: 'the next query runs on the new size' },
        { type: 'item', id: 'l-idle', icon: 'timer', title: '60 s with nothing to do', sub: 'AUTO_SUSPEND' },
        { type: 'item', id: 'l-off', icon: 'power', title: 'SUSPENDED', sub: 'what the last state.sql shows' },
      ],
    },
    {
      type: 'group', id: 'watched', badge: 3, title: 'Watched for 90 seconds', sub: 'state.sql, before and after the sleep', tone: 'neutral', children: [
        { type: 'table', id: 'states', columns: ['when', 'state'], rows: [['after the queries', state(0)], ['90 s later', state(1)]] },
      ],
    },
  ],
  edges: [
    { from: 'l-xs', to: 'l-s' },
    { from: 'l-s', to: 'l-idle' },
    { from: 'l-idle', to: 'l-off' },
  ],
})
