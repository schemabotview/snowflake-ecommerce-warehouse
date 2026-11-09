import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf } from '../ide'
import { ideFrame2 } from '../frame'
import { cell, rowsOf } from '../recorded'
import { performTree } from './tree'
import session from '../../../spine/perform/05-mv/session.txt?raw'
import sql from '../../../spine/perform/05-mv/project/queries/mv.sql?raw'

// §10.5 — A materialised view and search optimisation (recorded on Snowflake). November's revenue
// read twice: the scans' rows are the run's; search optimisation is ESTIMATED, never enabled.
const scan = (after: number) => {
  const ops = rowsOf(session, 'OPERATOR', 2, after, 4)
  return ops[ops.length - 1]
}
const [baseOp, baseRows] = scan(0)
const [mvOp, mvRows] = scan(1)
const costs = rowsOf(session, 'COST', 3, 0, 3).map(([c, v, u]) => [c.replace('Costs', ''), v === 'None' ? '—' : v, u === 'None' ? '' : u])

export const performMv: SceneModel = ideFrame2({
  model: 'TODO',
  tree: performTree('queries/mv.sql', 'queries/mv.sql'),
  editor: { file: 'queries/mv.sql', code: sql, show: [[1, lineOf(sql, 'WHERE order_date_key BETWEEN 20261101') ], [lineOf(sql, 'SELECT f.value'), lineOf(sql, 'DROP MATERIALIZED VIEW')]] },
  session,
  keep: ['| 287912', '| TableScan', '| Materialized View Scan', ['| COST', '| MaintenanceCosts']],
  side: [
    {
      type: 'group', id: 'mv', badge: 1, title: 'A materialised view: the answer, stored', tone: 'infra', children: [
        { type: 'item', id: 'm-base', icon: 'table', title: 'FCT_ORDER_LINES', sub: 'every paid line' },
        { type: 'item', id: 'm-view', icon: 'layers', title: 'MV_DAILY_REVENUE', sub: 'one row a day; Snowflake keeps it current' },
      ],
    },
    {
      type: 'group', id: 'read', badge: 2, title: 'November’s revenue, read two ways', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'r', columns: ['read from', 'operator', 'rows read'], rows: [
          ['the order lines', baseOp, baseRows],
          { cells: ['the view', mvOp, mvRows], tone: 'serve' },
        ] },
      ],
    },
    {
      type: 'group', id: 'sos', badge: 3, title: 'Search optimisation on order_id: the estimate', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 's', columns: ['cost', 'value', 'unit'], rows: costs },
      ],
    },
  ],
  edges: [
    { from: 'm-base', to: 'm-view', label: 'maintained' },
  ],
})
