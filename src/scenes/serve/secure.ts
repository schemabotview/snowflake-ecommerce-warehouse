import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { cell, rowsOf } from '../recorded'
import { serveTree } from './tree'
import session from '../../../spine/serve/06-secure-view/session.txt?raw'
import sql from '../../../spine/serve/06-secure-view/project/dbt/models/marts/bi/campaign_stats.sql?raw'

// §11.6 — A secure view (recorded on Snowflake): the analyst reads its rows; SHOW VIEWS gives the
// analyst no definition, the owner one.
const rows = rowsOf(session, 'CAMPAIGN_ID', 3, 0, 4)
const text = (after: number) => cell(session, 'TEXT', 0, after) || '(empty)'

export const serveSecure: SceneModel = ideFrame2({
  model: 'TODO',
  tree: serveTree('queries/secure.sql', 'dbt/models/marts/bi/campaign_stats.sql', ['dbt/models/marts/bi/campaign_stats.sql', 'queries/secure.sql']),
  editor: { file: 'dbt/models/marts/bi/campaign_stats.sql', code: sql },
  session,
  keep: [['| CAMPAIGN_ID', '| retarget'], ['| name', '| CAMPAIGN_STATS'], 'create or replace secure'],
  side: [
    {
      type: 'group', id: 'what', badge: 1, title: 'What a secure view hides', tone: 'infra', children: [
        { type: 'item', id: 's-rows', icon: 'table', title: 'The rows: shown', sub: 'to anyone granted SELECT' },
        { type: 'item', id: 's-def', icon: 'lock', title: 'The definition: hidden', sub: 'the SQL, the tables behind it' },
        { type: 'item', id: 's-opt', icon: 'shield', title: 'No shortcuts that leak', sub: 'the optimiser cannot expose filtered rows' },
      ],
    },
    {
      type: 'group', id: 'read', badge: 2, title: 'The analyst’s read', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'r', columns: ['campaign', 'visits', 'buying'], rows },
      ],
    },
    {
      type: 'group', id: 'show', badge: 3, title: 'SHOW VIEWS: the definition', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'd', columns: ['role', 'text'], rows: [{ cells: ['ANALYST', text(0)], tone: 'serve' }, ['TRANSFORMER (owner)', text(1)]] },
      ],
    },
  ],
  edges: [],
})
