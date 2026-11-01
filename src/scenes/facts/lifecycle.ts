import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf } from '../ide'
import { cell, rowsOf } from '../recorded'
import { factsTree } from './tree'
import session from '../../../spine/facts/02-lifecycle/session.txt?raw'
import sql from '../../../spine/facts/02-lifecycle/project/dbt/models/marts/fct_order_lifecycle.sql?raw'

// §9.2 — The order lifecycle: an accumulating snapshot, one row per order (recorded on Snowflake).
const n = (column: string) => cell(session, column)
const orders = rowsOf(session, 'ORDER_ID', 5, 0, 2).map((r) => r.map((c) => (c === 'None' ? '—' : c)))
const milestone = (id: string, title: string, column: string) => ({ type: 'item' as const, id, icon: 'check', title, sub: `${n(column)} orders` })

export const factsLifecycle: SceneModel = ideFrame({
  tree: factsTree('queries/lifecycle.sql', 'dbt/models/marts/fct_order_lifecycle.sql', ['load/order_changes_all.sql', 'dbt/models/staging/stg_order_changes.sql', 'dbt/models/marts/fct_order_lifecycle.sql', 'queries/lifecycle.sql']),
  editor: { file: 'dbt/models/marts/fct_order_lifecycle.sql', code: sql, show: [[lineOf(sql, 'with changes'), lineOf(sql, 'group by order_id')], [lineOf(sql, '    o.order_id,') - 1, lineOf(sql, 'left join returned')]] },
  session,
  keep: ['$ bash load/as-loader.sh', '| 358', '2 of 2 OK created', '$ bash model/as-transformer.sh', ['| ORDERS', '| 20024']],
  side: [
    {
      type: 'group', id: 'steps', badge: 1, title: 'One row per order, its milestones filling in', sub: 'from the run', tone: 'serve', children: [
        milestone('m-placed', 'placed', 'ORDERS'),
        milestone('m-paid', 'paid', 'PAID'),
        milestone('m-shipped', 'shipped', 'SHIPPED'),
        milestone('m-delivered', 'delivered', 'DELIVERED'),
        milestone('m-returned', 'returned', 'RETURNED'),
      ],
    },
    {
      type: 'group', id: 'two', badge: 2, title: 'Two orders, two stages', tone: 'neutral', children: [
        { type: 'table', id: 'o', columns: ['order', 'placed', 'paid', 'shipped', 'delivered'], rows: orders },
      ],
    },
    { type: 'note', id: 'upd', tone: 'consume', text: 'The one fact table whose rows CHANGE: an order’s row is rewritten as each milestone arrives. This one is rebuilt every run.' },
    { type: 'note', id: 'avg', tone: 'infra', text: `Placed to delivered: ${n('AVG_DAYS_TO_DELIVER')} days on average. The span between milestones is the measure this table exists for.` },
  ],
  edges: [
    { from: 'm-placed', to: 'm-paid' },
    { from: 'm-paid', to: 'm-shipped' },
    { from: 'm-shipped', to: 'm-delivered' },
    { from: 'm-delivered', to: 'm-returned' },
  ],
})
