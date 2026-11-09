import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { rowsOf } from '../recorded'
import { secureTree } from './tree'
import session from '../../../spine/secure/05-least-privilege/session.txt?raw'
import sql from '../../../spine/secure/05-least-privilege/project/queries/matrix.sql?raw'

// §4.5 — Least privilege: the matrix setup/grants.sql applies (its design, read off the file), and
// Snowflake's own account of two roles' grants in the terminal (recorded on Snowflake).
const N = '·'
const loader = rowsOf(session, 'privilege', 3, 0, 6)

export const secureLeastPrivilege: SceneModel = ideFrame2({
  model: 'TODO',
  tree: secureTree('queries/matrix.sql', 'queries/matrix.sql'),
  editor: { file: 'queries/matrix.sql', code: sql },
  session,
  keep: ['$ snow sql', 'SHOW GRANTS TO ROLE ANALYST', ['| privilege', '| USAGE     | WAREHOUSE']],
  side: [
    {
      type: 'group', id: 'matrix', badge: 1, title: 'Role × object', sub: 'setup/grants.sql, as a table', tone: 'infra', children: [
        { type: 'table', id: 'm', columns: ['', 'LOADER', 'TRANSFORMER', 'ANALYST'], rows: [
          { cells: ['WH_LOAD', 'use', N, N], tone: 'ingest' },
          { cells: ['WH_BI', N, N, 'use'], tone: 'serve' },
          ['RAW.SHOPWAVE', 'read, write', 'read', N],
          ['ANALYTICS.STAGING', N, 'build', N],
          ['ANALYTICS.MARTS', N, 'build', 'read'],
          ['ANALYTICS.BI', N, 'build', 'read'],
        ] },
      ],
    },
    {
      type: 'group', id: 'flow', badge: 2, title: 'Data flows one way; so do privileges', tone: 'neutral', dir: 'row', children: [
        { type: 'item', id: 'f-raw', icon: 'database', title: 'RAW', sub: 'LOADER writes', stack: true },
        { type: 'item', id: 'f-an', icon: 'layers', title: 'ANALYTICS', sub: 'TRANSFORMER builds', stack: true },
        { type: 'item', id: 'f-bi', icon: 'chart', title: 'Marts, BI', sub: 'ANALYST reads', stack: true },
      ],
    },
    {
      type: 'group', id: 'loader', badge: 3, title: 'LOADER, as Snowflake reports it', sub: 'SHOW GRANTS TO ROLE, from the run', tone: 'ingest', children: [
        { type: 'table', id: 'loader-grants', columns: ['privilege', 'on', 'name'], rows: loader },
      ],
    },
  ],
  edges: [
    { from: 'f-raw', to: 'f-an' },
    { from: 'f-an', to: 'f-bi' },
  ],
})
