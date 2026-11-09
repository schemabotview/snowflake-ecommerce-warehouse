import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { rowsOf } from '../recorded'
import { factsTree } from './tree'
import session from '../../../spine/facts/08-factless/session.txt?raw'
import sql from '../../../spine/facts/08-factless/project/dbt/models/marts/fct_eligibility.sql?raw'

// §9.8 — A factless fact: who could have used a campaign (recorded on Snowflake). The rows that
// did NOT lead to a purchase are what the table is for.
const campaigns = rowsOf(session, 'CAMPAIGN_ID', 3, 0, 4).map(([c, e, b]) => [c, e, b, String(Number(e) - Number(b))])

export const factsFactless: SceneModel = ideFrame2({
  model: 'A factless fact: what could have happened',
  tree: factsTree('queries/eligibility.sql', 'dbt/models/marts/fct_eligibility.sql', ['load/campaigns.sql', 'dbt/models/marts/fct_eligibility.sql', 'queries/eligibility.sql']),
  editor: { file: 'dbt/models/marts/fct_eligibility.sql', code: sql },
  session,
  keep: ['$ bash load/as-loader.sh', '| LOADED', '1 of 1 OK created', ['| CAMPAIGN_ID', '+---------------------------------------------+']],
  side: [
    {
      type: 'group', id: 'what', badge: 1, title: 'A row with no measure', tone: 'infra', children: [
        { type: 'item', id: 'e-camp', icon: 'zap', title: 'CAMPAIGNS', sub: 'four, each with its dates' },
        { type: 'item', id: 'e-visit', icon: 'users', title: 'Customers who visited while it ran', sub: 'fct_sessions, 9.4: the visit’s day in its dates' },
        { type: 'item', id: 'e-row', icon: 'table', title: 'One row: campaign × customer', sub: 'the row is the fact' },
      ],
    },
    {
      type: 'group', id: 'who', badge: 2, title: 'Could have, did, did not', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'c', columns: ['campaign', 'eligible', 'bought', 'did not'], rows: campaigns },
      ],
    },
  ],
  edges: [
    { from: 'e-camp', to: 'e-visit' },
    { from: 'e-visit', to: 'e-row' },
  ],
})
