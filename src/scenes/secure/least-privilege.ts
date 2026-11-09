import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { secureTree } from './tree'
import session from '../../../spine/secure/05-least-privilege/session.txt?raw'
import sql from '../../../spine/secure/05-least-privilege/project/queries/matrix.sql?raw'

// §4.5 — Least privilege: the matrix setup/grants.sql applies (its design, read off the file), and
// Snowflake's own account of two roles' grants in the terminal (recorded on Snowflake).
const N = '·'

export const secureLeastPrivilege: SceneModel = ideFrame2({
  model: 'Each role gets only its job',
  tree: secureTree('queries/matrix.sql', 'queries/matrix.sql'),
  editor: { file: 'queries/matrix.sql', code: sql },
  session,
  keep: ['$ snow sql', 'SHOW GRANTS TO ROLE ANALYST', ['| privilege', '| USAGE     | WAREHOUSE']],
  side: [
    { type: 'table', id: 'm', title: 'Role × object', tone: 'infra', columns: ['', 'LOADER', 'TRANSF.', 'ANALYST'], rows: [
      { cells: ['WH_LOAD', 'use', N, N], tone: 'ingest' },
      { cells: ['WH_BI', N, N, 'use'], tone: 'serve' },
      ['RAW', 'read, write', 'read', N],
      ['STAGING', N, 'build', N],
      ['MARTS', N, 'build', 'read'],
      ['BI', N, 'build', 'read'],
    ] },
    {
      type: 'group', id: 'flow', badge: 2, title: 'Data flows one way; so do privileges', tone: 'neutral', dir: 'row', children: [
        { type: 'item', id: 'f-raw', icon: 'database', title: 'RAW', sub: 'LOADER writes', stack: true },
        { type: 'item', id: 'f-an', icon: 'layers', title: 'ANALYTICS', sub: 'TRANSFORMER builds', stack: true },
        { type: 'item', id: 'f-bi', icon: 'chart', title: 'Marts, BI', sub: 'ANALYST reads', stack: true },
      ],
    },
  ],
  edges: [
    { from: 'f-raw', to: 'f-an' },
    { from: 'f-an', to: 'f-bi' },
  ],
})
