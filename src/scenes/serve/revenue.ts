import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { rowsOf } from '../recorded'
import { serveTree } from './tree'
import session from '../../../spine/serve/01-revenue/session.txt?raw'
import sql from '../../../spine/serve/01-revenue/project/dbt/models/marts/bi/mart_revenue.sql?raw'

// §11.1 — The revenue mart (recorded on Snowflake): the star, collapsed to what the dashboard reads.
const week = rowsOf(session, 'DATE', 2, 0, 7).map(([d, r]) => (d === '2026-11-27' ? { cells: [`${d} (Black Friday)`, r], tone: 'serve' as const } : [d, r]))

export const serveRevenue: SceneModel = ideFrame({
  tree: serveTree('queries/revenue.sql', 'dbt/models/marts/bi/mart_revenue.sql', ['dbt/models/marts/bi/mart_revenue.sql', 'queries/revenue.sql']),
  editor: { file: 'dbt/models/marts/bi/mart_revenue.sql', code: sql },
  session,
  keep: ['1 of 1 OK created', ['| DATE', '| 2026-11-29']],
  side: [
    {
      type: 'group', id: 'from', badge: 1, title: 'From the star to the mart', tone: 'infra', children: [
        { type: 'item', id: 'r-star', icon: 'layers', title: 'fct_order_lines + dim_date + dim_product', sub: 'one row per order line' },
        { type: 'item', id: 'r-mart', icon: 'pie', title: 'BI.MART_REVENUE', sub: 'one row per day and category: paid, in EUR' },
        { type: 'item', id: 'r-dash', icon: 'chart', title: 'The dashboard', sub: 'reads the mart, never the star' },
      ],
    },
    {
      type: 'group', id: 'wk', badge: 2, title: 'Black Friday week, from the mart', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'w', columns: ['day', 'revenue €'], rows: week },
      ],
    },
    { type: 'note', id: 'aov', tone: 'consume', text: 'Orders and AOV are per category: an order with two categories counts in both, so a day’s orders are not the sum of its rows.' },
  ],
  edges: [
    { from: 'r-star', to: 'r-mart' },
    { from: 'r-mart', to: 'r-dash' },
  ],
})
