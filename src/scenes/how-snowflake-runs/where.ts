import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { cell } from '../recorded'
import { howTree } from './tree'
import session from '../../../spine/how-snowflake-runs/04-where/session.txt?raw'
import sql from '../../../spine/how-snowflake-runs/04-where/project/queries/where.sql?raw'

// §2.4 — Organisations, accounts, clouds, regions. The names are the recorder's (normalised:
// COURSE-PLAN.md, "Facts"); the hierarchy is doc-cited (docs.snowflake.com/en/user-guide/organizations).
const org = cell(session, 'ORG'), account = cell(session, 'ACCOUNT'), locator = cell(session, 'LOCATOR'), region = cell(session, 'REGION')

export const howWhere: SceneModel = ideFrame({
  tree: howTree('queries/where.sql', 'queries/where.sql'),
  editor: { file: 'queries/where.sql', code: sql },
  session,
  side: [
    {
      type: 'group', id: 'tree', badge: 1, title: 'Where an account lives', sub: 'organisation → account → cloud and region', tone: 'infra', children: [
        { type: 'item', id: 'h-org', icon: 'building', title: `Organisation ${org}`, sub: 'the company: owns accounts, billing' },
        { type: 'item', id: 'h-account', icon: 'snowflakedb', title: `Account ${account}`, sub: `identifier ${org}-${account}` },
        { type: 'item', id: 'h-cloud', icon: 'cloud', title: 'Cloud: AWS', sub: 'chosen when the account is made' },
        { type: 'item', id: 'h-region', icon: 'region', title: `Region ${region}`, sub: 'N. Virginia: the data stays here' },
      ],
    },
    {
      type: 'group', id: 'names', badge: 2, title: 'Two names for one account', tone: 'neutral', children: [
        { type: 'table', id: 'ids', columns: ['name', 'example'], rows: [
          { cells: ['org-account', `${org}-${account}`], tone: 'serve' },
          { cells: ['locator', locator] },
        ] },
      ],
    },
    { type: 'note', id: 'why', tone: 'neutral', text: 'The organisation–account name is the one to use; the locator is the older, region-bound name.' },
  ],
  edges: [
    { from: 'h-org', to: 'h-account' },
    { from: 'h-account', to: 'h-cloud', label: 'runs on' },
    { from: 'h-cloud', to: 'h-region' },
  ],
})
