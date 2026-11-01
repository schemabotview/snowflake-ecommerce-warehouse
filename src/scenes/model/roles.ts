import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { rowsOf } from '../recorded'
import { star } from '../star'
import { modelTree } from './tree'
import session from '../../../spine/model/08-roles/session.txt?raw'
import sql from '../../../spine/model/08-roles/project/queries/two_dates.sql?raw'

// §6.8 — Degenerate and role-playing dimensions: order_id stays in the fact with no dimension; one
// dim_date plays "ordered" and "paid" (recorded on Snowflake). paid_date_key is the FIRST payment's.
const s = star({ stage: 'roles', dims: ['date', 'customer', 'product'], lit: ['order_id', 'order_date_key', 'paid_date_key'] })
const crossed = rowsOf(session, 'ORDERED', 3, 0, 5)
const unpaid = rowsOf(session, 'UNPAID', 1)[0]

export const modelRoles: SceneModel = ideFrame({
  tree: modelTree('queries/two_dates.sql', 'queries/two_dates.sql', ['model/fct_order_lines.sql', 'queries/two_dates.sql']),
  editor: { file: 'queries/two_dates.sql', code: sql },
  session,
  keep: ['$ bash model/as-transformer.sh -f model/fct_order_lines.sql', '$ bash model/as-transformer.sh -f queries/two_dates.sql', ['| ORDERED', '| 2026-01-17'], ['| ORDERS | UNPAID', '| 20024']],
  side: [
    s.node,
    {
      type: 'group', id: 'midnight', badge: 1, title: 'Ordered one day, paid the next', sub: 'from the run: the first five', tone: 'neutral', children: [
        { type: 'table', id: 'pairs', columns: ['ordered', 'paid', 'orders'], rows: crossed },
      ],
    },
    { type: 'note', id: 'unpaid', tone: 'consume', text: `Orders with no paid date at all: ${unpaid[0]}: the cancelled ones, and the planted unpaid orders. Course 7 turns the second kind into a failing test.` },
  ],
  edges: s.edges,
})
