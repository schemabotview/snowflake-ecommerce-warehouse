import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { cell, rowsOf } from '../recorded'
import { secureTree } from './tree'
import session from '../../../spine/secure/06-refused/session.txt?raw'
import sql from '../../../spine/secure/06-refused/project/queries/refused.sql?raw'

// §4.6 — A refused query: ANALYST tries to UPDATE RAW and Snowflake refuses (recorded on Snowflake:
// the error is the run's own); then the grants on RAW, which explain it.
const onRaw = rowsOf(session, 'privilege', 2, 0, 3)
const products = cell(session, 'PRODUCTS')

export const secureRefused: SceneModel = ideFrame2({
  model: 'No grant: the object does not exist',
  tree: secureTree('queries/raw_grants.sql', 'queries/refused.sql', ['queries/refused.sql', 'queries/raw_grants.sql']),
  editor: { file: 'queries/refused.sql', code: sql },
  session,
  keep: ['$ snow sql --role ANALYST', '| ANALYST', '| 50', 'USE SECONDARY ROLES NONE', ['Database \'RAW\'', 'must have USAGE'], '$ snow sql -f queries/raw_grants.sql'],
  side: [
    {
      type: 'group', id: 'path', badge: 1, title: 'Primary role, and secondary roles', sub: 'Ana, working as ANALYST', tone: 'consume', children: [
        { type: 'item', id: 'p-all', icon: 'users', title: 'Secondary roles: ALL', sub: `every role she holds counts too: RAW read, ${products} products` },
        { type: 'item', id: 'p-none', icon: 'filter', title: 'USE SECONDARY ROLES NONE', sub: 'only ANALYST counts, as for Ravi' },
        { type: 'item', id: 'p-db', icon: 'database', title: 'USAGE on RAW: never granted', sub: 'the UPDATE stops here, refused', tone: 'consume' },
      ],
    },
    {
      type: 'group', id: 'grants', badge: 3, title: 'Grants on RAW', sub: 'SHOW GRANTS ON DATABASE, from the run', tone: 'neutral', children: [
        { type: 'table', id: 'raw-grants', columns: ['privilege', 'to role'], rows: onRaw },
      ],
    },
  ],
  edges: [
    { from: 'p-all', to: 'p-none' },
    { from: 'p-none', to: 'p-db' },
  ],
})
