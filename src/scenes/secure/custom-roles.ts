import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { rowsOf } from '../recorded'
import { secureTree } from './tree'
import session from '../../../spine/secure/03-custom-roles/session.txt?raw'
import sql from '../../../spine/secure/03-custom-roles/project/setup/roles.sql?raw'

// §4.3 — Custom roles under SYSADMIN (recorded on Snowflake).
const analyst = rowsOf(session, 'granted_to', 2, 0, 3)

export const secureCustomRoles: SceneModel = ideFrame({
  tree: secureTree('setup/roles.sql', 'setup/roles.sql'),
  editor: { file: 'setup/roles.sql', code: sql },
  session,
  keep: ['$ snow sql -f setup/roles.sql', ['| granted_to', '| ROLE       | SYSADMIN']],
  side: [
    { type: 'item', id: 'c-sys', icon: 'users', title: 'SYSADMIN', sub: 'inherits every team role: the admins keep control', tone: 'store' },
    {
      type: 'group', id: 'teams', bare: true, dir: 'row', children: [
        { type: 'item', id: 'c-loader', icon: 'package', title: 'LOADER', sub: 'data team', stack: true, tone: 'ingest' },
        { type: 'item', id: 'c-transformer', icon: 'workflow', title: 'TRANSFORMER', sub: 'analytics', stack: true, tone: 'store' },
        { type: 'item', id: 'c-analyst', icon: 'chart', title: 'ANALYST', sub: 'BI, finance', stack: true, tone: 'serve' },
      ],
    },
    {
      type: 'group', id: 'who', title: 'Who holds ANALYST', sub: 'SHOW GRANTS OF ROLE, from the run', icon: 'users', tone: 'neutral', children: [
        { type: 'table', id: 'holders', columns: ['granted to', 'name'], rows: analyst },
      ],
    },
    {
      type: 'group', id: 'jobs', title: 'Each role’s job', icon: 'workflow', tone: 'neutral', children: [
        { type: 'table', id: 'job', columns: ['role', 'held by', 'its warehouse'], rows: [
          { cells: ['LOADER', 'data team, svc_loader', 'WH_LOAD'], tone: 'ingest' },
          { cells: ['TRANSFORMER', 'analytics, svc_dbt', 'WH_TRANSFORM (7)'], tone: 'store' },
          { cells: ['ANALYST', 'BI, finance: Ravi', 'WH_BI (next)'], tone: 'serve' },
        ] },
      ],
    },
    { type: 'note', id: 'why-sys', tone: 'neutral', text: 'A custom role not granted to SYSADMIN is an orphan: what it creates, no administrator can see.' },
  ],
  edges: [
    { from: 'c-sys', to: 'c-loader' },
    { from: 'c-sys', to: 'c-transformer' },
    { from: 'c-sys', to: 'c-analyst' },
  ],
})
