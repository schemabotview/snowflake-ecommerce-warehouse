import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { transformTree } from './tree'
import { DAG } from './dag'
import session from '../../../spine/transform/03-staging/session.txt?raw'
import sql from '../../../spine/transform/03-staging/project/dbt/models/staging/stg_clicks.sql?raw'

// §7.3 — Staging models: one view per source, renamed, cast, clicks deduplicated (recorded on
// Snowflake). The source → model pairs are read from the parsed DAG (7.4, runs locally).
const pairs = DAG.filter((n) => n.name.startsWith('stg_')).map((n) => [n.parents[0], n.name])

export const transformStaging: SceneModel = ideFrame2({
  model: 'TODO',
  tree: transformTree('dbt/models/staging/stg_products.sql', 'dbt/models/staging/stg_clicks.sql', ['dbt/models/staging/stg_clicks.sql', 'dbt/models/staging/stg_orders.sql', 'dbt/models/staging/stg_order_items.sql']),
  editor: { file: 'dbt/models/staging/stg_clicks.sql', code: sql },
  session,
  keep: ['$ cd dbt', '$ dbt run --select staging', 'Found ', 'Finished running 8 view models', 'Done. PASS=8'],
  side: [
    {
      type: 'group', id: 'one', badge: 1, title: 'One source, one staging model', sub: 'source() points at RAW: a view on top', tone: 'store', children: [
        { type: 'table', id: 'map', columns: ['RAW.SHOPWAVE', 'ANALYTICS.STAGING'], rows: pairs.map(([s, m]) => ({ cells: [s, m], tone: m === 'stg_clicks' ? 'serve' as const : undefined })) },
      ],
    },
    {
      type: 'group', id: 'clicks', badge: 2, title: 'What stg_clicks does', tone: 'infra', children: [
        { type: 'item', id: 'k-var', icon: 'table', title: 'VARIANT → typed columns', sub: 'event_id, event_ts, event_type …' },
        { type: 'item', id: 'k-dev', icon: 'filter', title: 'One device, both shapes', sub: 'June 1’s rename, settled here (5.7)' },
        { type: 'item', id: 'k-dup', icon: 'check', title: 'One row per event_id', sub: 'QUALIFY drops the tracker’s duplicates' },
      ],
    },
  ],
  edges: [
    { from: 'k-var', to: 'k-dev' },
    { from: 'k-dev', to: 'k-dup' },
  ],
})
