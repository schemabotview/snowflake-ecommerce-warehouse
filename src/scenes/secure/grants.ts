import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { rowsOf } from '../recorded'
import { secureTree } from './tree'
import session from '../../../spine/secure/04-grants/session.txt?raw'
import sql from '../../../spine/secure/04-grants/project/setup/grants.sql?raw'

// §4.4 — Grants and future grants (recorded on Snowflake). WH_BI is created here for the analysts.
// After recording: the three commands' output will exceed the terminal's 13 rows — fold with `keep`.
const future = rowsOf(session, 'privilege', 3, 0, 4)

export const secureGrants: SceneModel = ideFrame2({
  model: 'TODO',
  tree: secureTree('queries/future.sql', 'setup/grants.sql', ['setup/grants.sql', 'queries/future.sql', 'setup/warehouses.sql']),
  editor: { file: 'setup/grants.sql', code: sql, ...view(sql, '-- LOADER', '-- ANALYST', 0) },
  session,
  keep: ['$ snow sql -f setup/warehouses.sql', '$ snow sql -f setup/grants.sql', '$ snow sql -f queries/future.sql', ['| privilege', '| SELECT    | TABLE    | TRANSFORMER']],
  side: [
    {
      type: 'group', id: 'shape', badge: 1, title: 'A grant: a privilege, on an object, to a role', tone: 'infra', children: [
        { type: 'item', id: 'g-obj', icon: 'table', title: 'RAW.SHOPWAVE', sub: 'a schema: the object' },
        { type: 'item', id: 'g-priv', icon: 'key', title: 'SELECT, INSERT', sub: 'what may be done' },
        { type: 'item', id: 'g-role', icon: 'users', title: 'LOADER', sub: 'who may do it' },
      ],
    },
    {
      type: 'group', id: 'future', badge: 2, title: 'Future grants in RAW.SHOPWAVE', sub: 'from the run: tables that do not exist yet', tone: 'neutral', children: [
        { type: 'table', id: 'fg', columns: ['privilege', 'on', 'to'], rows: future },
      ],
    },
    {
      type: 'group', id: 'scope', badge: 3, title: 'How far a grant reaches', tone: 'infra', children: [
        { type: 'table', id: 'scopes', columns: ['grant … ON', 'covers'], rows: [
          ['TABLE PRODUCTS', 'that one table'],
          ['ALL TABLES IN SCHEMA', 'every table there today'],
          { cells: ['FUTURE TABLES IN SCHEMA', 'every table created later'], tone: 'serve' },
        ] },
      ],
    },
  ],
  edges: [
    { from: 'g-priv', to: 'g-obj', label: 'on' },
    { from: 'g-priv', to: 'g-role', label: 'to' },
  ],
})
