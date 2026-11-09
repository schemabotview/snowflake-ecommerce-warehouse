import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf } from '../ide'
import { ideFrame2 } from '../frame'
import { rowsOf } from '../recorded'
import { serveTree } from './tree'
import session from '../../../spine/serve/03-metrics/session.txt?raw'
import sql from '../../../spine/serve/03-metrics/project/dbt/models/marts/bi/metrics_monthly.sql?raw'

// §11.3 — One definition of revenue (recorded on Snowflake). The two "old answers" are the numbers
// earlier courses printed for November (10.2: every line; 10.5: paid only), asked again here.
const answers = rowsOf(session, 'ANSWER', 2, 0, 3).map(([a, v]) => (a.startsWith('paid, net') ? { cells: [a, v], tone: 'serve' as const } : [a, v]))
const months = rowsOf(session, 'MONTH', 6, 0, 4).map(([m, , g, r, n]) => [m, g, r, n])

export const serveMetrics: SceneModel = ideFrame2({
  model: 'One definition of revenue, for everyone',
  tree: serveTree('queries/one_revenue.sql', 'dbt/models/marts/bi/metrics_monthly.sql', ['dbt/models/marts/bi/metrics_monthly.sql', 'queries/one_revenue.sql']),
  editor: { file: 'dbt/models/marts/bi/metrics_monthly.sql', code: sql, show: [[1, 2], [lineOf(sql, 'refunds as ('), lineOf(sql, 'left join refunds')]] },
  session,
  keep: ['| every order line', '| paid orders only', '| paid, net', ['| MONTH', '| 2026-12']],
  side: [
    {
      type: 'group', id: 'def', badge: 1, title: 'Revenue, defined once', tone: 'infra', dir: 'row', children: [
        { type: 'item', id: 'd-paid', icon: 'filter', title: 'Paid orders only', sub: 'not cancelled', stack: true },
        { type: 'item', id: 'd-eur', icon: 'card', title: 'In EUR', sub: 'never mixed', stack: true },
        { type: 'item', id: 'd-net', icon: 'package', title: 'Net of refunds', sub: 'returns (9.3)', stack: true },
      ],
    },
    { type: 'table', title: 'November, three ways (from the run)', id: 'a', columns: ['answer', 'EUR'], rows: answers },
    {
      type: 'group', id: 'mo', badge: 2, title: 'BI.METRICS_MONTHLY', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'm', columns: ['month', 'gross €', 'refunds €', 'net €'], rows: months },
      ],
    },
  ],
  edges: [
    { from: 'd-paid', to: 'd-eur' },
    { from: 'd-eur', to: 'd-net' },
    { from: 'd-net', to: 'a' },
  ],
})
