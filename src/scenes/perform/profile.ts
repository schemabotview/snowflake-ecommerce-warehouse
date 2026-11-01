import type { Item, SceneModel } from '@graphlearning/graphl-flow'
import { rowsOf } from '../recorded'
import session from '../../../spine/perform/01-profile/session.txt?raw'

// §10.1 — ◆ The query profile, as rows (recorded on Snowflake): GET_QUERY_OPERATOR_STATS on the
// dashboard's query. The tree is drawn from the run's id/parent columns. Which table each TableScan
// read is not in the output; it is derived from the row counts (66 = DIM_PRODUCT's rows in 10.7's
// run, 30 = November's days, the rest = the order lines) and named as such.
const ops = rowsOf(session, 'ID', 5, 0, 15)
const op = (id: string) => ops.find((r) => r[0] === id) ?? [id, '…', '…', '…', '…']
const READS: Record<string, string> = { '66': 'DIM_PRODUCT', '30': 'DIM_DATE, November' }
const node = (id: string): Item => {
  const [, name, , rows, pct] = op(id)
  const what = name === 'TableScan' ? ` · ${READS[rows] ?? 'FCT_ORDER_LINES'}` : ''
  const busy = Number(pct) >= 50
  return { type: 'item', id: `op${id}`, icon: name === 'TableScan' ? 'table' : name.includes('Join') ? 'workflow' : name === 'Filter' ? 'filter' : 'layers',
    title: `${id} ${name}${what}`, sub: `${rows === 'None' ? '—' : rows} rows out · ${pct}% of the time`, tone: busy ? 'consume' : undefined }
}
const col = (id: string, title: string, ids: string[]) => ({ type: 'group' as const, id, title, tone: 'neutral' as const, children: ids.map(node) })

export const performProfile: SceneModel = {
  title: 'The query profile: how Snowflake ran the dashboard’s query',
  sub: 'November’s revenue by day and category: fifteen operators, read from GET_QUERY_OPERATOR_STATS',
  nodes: [
    {
      type: 'group', id: 'tree', bare: true, dir: 'row', children: [
        col('c-fact', 'The order lines', ['14', '13', '12', '11']),
        col('c-date', 'The date dimension', ['10', '9', '8', '7']),
        col('c-out', 'The product dimension, then the answer', ['6', '5', '4', '3', '2', '1', '0']),
      ],
    },
    {
      type: 'group', id: 'notes', bare: true, dir: 'row', children: [
        { type: 'note', id: 'read', tone: 'neutral', text: 'Read each column from the top: rows flow from the scans, through filters and joins, into the result. The red operator took most of the time: reading the order lines.' },
        { type: 'note', id: 'jf', tone: 'serve', text: 'JoinFilter: Snowflake used the dates the join needs to skip order lines before reading them. That is pruning at run time, the next section’s subject.' },
      ],
    },
  ],
  edges: [
    { from: 'op14', to: 'op13' }, { from: 'op13', to: 'op12' }, { from: 'op12', to: 'op11' }, { from: 'op11', to: 'op8' },
    { from: 'op10', to: 'op9' }, { from: 'op9', to: 'op8' }, { from: 'op8', to: 'op7' }, { from: 'op7', to: 'op4' },
    { from: 'op6', to: 'op5' }, { from: 'op5', to: 'op4' }, { from: 'op4', to: 'op3' }, { from: 'op3', to: 'op2' }, { from: 'op2', to: 'op1' }, { from: 'op1', to: 'op0' },
  ],
}
