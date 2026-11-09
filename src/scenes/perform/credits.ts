import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { rowsOf } from '../recorded'
import { performTree } from './tree'
import session from '../../../spine/perform/07-credits/session.txt?raw'
import macro from '../../../spine/perform/07-credits/project/dbt/macros/set_query_tag.sql?raw'

// §10.7 — Credits per model (recorded on Snowflake): every model's queries tagged with its name,
// then the warehouse's history grouped by tag. Seconds are volatile: read, never narrated.
const models = rowsOf(session, 'MODEL', 4, 0, 6)

export const performCredits: SceneModel = ideFrame2({
  model: 'Query tags: a bill split by model',
  tree: performTree('queries/credits.sql', 'dbt/macros/set_query_tag.sql', ['dbt/macros/set_query_tag.sql', 'queries/credits.sql']),
  editor: { file: 'dbt/macros/set_query_tag.sql', code: macro },
  session,
  keep: ['Done. PASS=22', ['| MODEL', '+------------------------------------------------+']],
  side: [
    {
      type: 'group', id: 'how', badge: 1, title: 'From a run to a bill, by model', tone: 'infra', children: [
        { type: 'item', id: 'k-tag', icon: 'workflow', title: 'set_query_tag(): the model’s name', sub: 'on every query dbt runs for it' },
        { type: 'item', id: 'k-hist', icon: 'clock', title: 'The warehouse’s query history', sub: 'grouped by that tag' },
        { type: 'item', id: 'k-share', icon: 'pie', title: 'Each model’s share of the time', sub: 'its share of the warehouse’s credits' },
      ],
    },
    {
      type: 'group', id: 'top', badge: 2, title: 'Where WH_TRANSFORM’s time went', sub: 'the six biggest models, from the run', tone: 'neutral', children: [
        { type: 'table', id: 't', columns: ['model', 'queries', 'seconds', '%'], rows: models },
      ],
    },
    { type: 'item', id: 'bill', icon: 'clock', tone: 'consume', title: 'Billed per second running, not per query', sub: 'time share splits a run’s bill across models' },
  ],
  edges: [
    { from: 'k-tag', to: 'k-hist' },
    { from: 'k-hist', to: 'k-share' },
  ],
})
