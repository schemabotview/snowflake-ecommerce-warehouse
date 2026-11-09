import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { cell, rowsOf } from '../recorded'
import { historyTree } from './tree'
import session from '../../../spine/history/04-point-in-time/session.txt?raw'
import sql from '../../../spine/history/04-point-in-time/project/dbt/models/marts/core/fct_order_lines.sql?raw'

// §8.4 — The price (and the customer) at the time of order: point-in-time joins (recorded on Snowflake).
const orders = rowsOf(session, 'ORDER_ID', 5, 0, 5)
const lines = cell(session, 'LINES'), listed = cell(session, 'PRICED_AS_LISTED')

export const historyPointInTime: SceneModel = ideFrame2({
  model: 'Point in time: the version valid when it happened',
  tree: historyTree('queries/point_in_time.sql', 'dbt/models/marts/core/fct_order_lines.sql', ['dbt/models/marts/core/dim_customer.sql', 'dbt/models/marts/core/fct_order_lines.sql', 'queries/point_in_time.sql']),
  editor: { file: 'dbt/models/marts/core/fct_order_lines.sql', code: sql, ...view(sql, 'from {{ ref', '{% endif %}', 0) },
  session,
  keep: ['$ dbt run --select dim_customer fct_order_lines --full-refresh', 'Done. PASS=2', ['| ORDER_ID', '| 342 '], '| 4175', '| 35043'],
  side: [
    {
      type: 'group', id: 'join', badge: 1, title: 'An order finds the version valid that day', tone: 'infra', children: [
        { type: 'item', id: 'p-order', icon: 'card', title: 'An order line, ordered at T', sub: 'say, one of customer 81’s' },
        { type: 'item', id: 'p-ver', icon: 'layers', title: 'valid_from ≤ T < valid_to', sub: 'exactly one version of each matches' },
        { type: 'item', id: 'p-key', icon: 'key', title: 'That version’s key', sub: 'stored on the fact row, for good' },
      ],
    },
    {
      type: 'group', id: 'c81', badge: 2, title: 'Customer 81’s orders, then and now', sub: 'from the run', tone: 'serve', children: [
        { type: 'table', id: 'o', columns: ['order', 'ordered', 'country then', 'tier then', 'country now'], rows: orders },
      ],
    },
    { type: 'item', id: 'priced', icon: 'check', tone: 'serve', title: `Priced as listed that day: ${listed} of ${lines} lines`, sub: 'every order line against its product version, from the run' },
  ],
  edges: [
    { from: 'p-order', to: 'p-ver' },
    { from: 'p-ver', to: 'p-key' },
  ],
})
