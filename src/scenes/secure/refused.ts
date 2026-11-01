import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { rowsOf } from '../recorded'
import { secureTree } from './tree'
import session from '../../../spine/secure/06-refused/session.txt?raw'
import sql from '../../../spine/secure/06-refused/project/queries/refused.sql?raw'

// §4.6 — A refused query: ANALYST tries to UPDATE RAW and Snowflake refuses (recorded on Snowflake:
// the error is the run's own); then the grants on RAW, which explain it.
const onRaw = rowsOf(session, 'privilege', 2, 0, 4)

export const secureRefused: SceneModel = ideFrame({
  tree: secureTree('queries/raw_grants.sql', 'queries/refused.sql', ['queries/refused.sql', 'queries/raw_grants.sql']),
  editor: { file: 'queries/refused.sql', code: sql },
  session,
  side: [
    {
      type: 'group', id: 'path', badge: 1, title: 'What the UPDATE needed', sub: 'every link in the chain, as ANALYST', tone: 'consume', children: [
        { type: 'item', id: 'p-wh', icon: 'cpu', title: 'USAGE on WH_BI', sub: 'granted' },
        { type: 'item', id: 'p-db', icon: 'database', title: 'USAGE on RAW', sub: 'never granted: the query stops here', tone: 'consume' },
        { type: 'item', id: 'p-tbl', icon: 'table', title: 'UPDATE on PRODUCTS', sub: 'never reached', muted: true },
      ],
    },
    {
      type: 'group', id: 'reading', badge: 2, title: 'Reading the refusal', tone: 'neutral', children: [
        { type: 'item', id: 'r-hide', icon: 'shield', title: '“does not exist or not authorized”', sub: 'a role cannot even learn the object is there' },
        { type: 'item', id: 'r-fix', icon: 'search', title: 'SHOW GRANTS ON DATABASE RAW', sub: 'who may: LOADER, TRANSFORMER, the admins' },
      ],
    },
    {
      type: 'group', id: 'grants', badge: 3, title: 'Grants on RAW', sub: 'SHOW GRANTS ON DATABASE, from the run', tone: 'neutral', children: [
        { type: 'table', id: 'raw-grants', columns: ['privilege', 'to role'], rows: onRaw },
      ],
    },
    { type: 'note', id: 'right', tone: 'serve', text: 'The refusal is correct: a wrong price is fixed in the shop’s database and reloaded, never edited in RAW.' },
  ],
  edges: [
    { from: 'p-wh', to: 'p-db' },
    { from: 'p-db', to: 'p-tbl', dashed: true },
  ],
})
