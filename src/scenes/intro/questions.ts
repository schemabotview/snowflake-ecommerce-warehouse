import type { SceneModel, Table } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { projectTree } from '../tree'
import session from '../../../spine/intro/01-questions/session.txt?raw'
import query from '../../../spine/intro/01-questions/project/queries/revenue_by_month.sql?raw'

// §1.1 — Questions the shop database cannot answer (well). The real psql run on PostgreSQL 18.6, SF
// 0.01; the side pane is the join tree that one monthly question needs: three tables, joined by
// their keys, every line of the year grouped. Level: runs locally.
// The answer, drawn: each month's six category columns added up, read from the transcript.
const months = session.split('\n').filter((l) => /^ 2026-\d\d \|/.test(l)).map((l) => {
  const [month, ...cells] = l.split('|').map((c) => c.trim())
  return { month: Number(month.slice(5)), total: cells.reduce((a, c) => a + Number(c), 0) }
})
if (months.length !== 12) throw new Error(`questions.ts: ${months.length} months in the session, not 12`)
const LETTERS = 'JFMAMJJASOND'.split('')

const table = (id: string, title: string, rows: [string, string?][]): Table => ({
  type: 'table', id, title, rows: rows.map(([col, tag]) => ({ cells: [col], tag })),
})

export const introQuestions: SceneModel = ideFrame2({
  model: 'TODO',
  tree: projectTree(['shop/schema.sql', 'shop/load.sql', 'queries/revenue_by_month.sql'], {
    active: 'queries/revenue_by_month.sql', made: { 'data/': 'shopwave_gen' },
  }),
  editor: { file: 'queries/revenue_by_month.sql', code: query },
  session,
  keep: ['$ psql', 'month', '---', '2026-01', ['2026-10', '(12 rows)']],
  side: [
    {
      type: 'group', id: 'join', badge: 1, title: 'One question, three tables', sub: 'joined by their keys, for every line', tone: 'source', children: [
        {
          type: 'group', id: 'tables', bare: true, dir: 'row', children: [
            table('t-orders', 'orders', [['order_id', 'PK'], ['order_ts'], ['status']]),
            table('t-items', 'order_items', [['order_id', 'FK'], ['product_id', 'FK'], ['qty'], ['unit_price']]),
            table('t-products', 'products', [['product_id', 'PK'], ['category']]),
          ],
        },
      ],
    },
    {
      type: 'group', id: 'built-for', badge: 2, title: 'What the shop database is built for', tone: 'neutral', children: [
        { type: 'item', id: 'oltp-one', icon: 'card', title: 'One order at a time', sub: 'insert it, update it, find it by its key' },
        { type: 'item', id: 'oltp-all', icon: 'search', title: 'This question: the whole year', sub: 'every order line read, joined twice, grouped by month' },
        { type: 'item', id: 'oltp-next', icon: 'zap', title: 'Every analyst, every month', sub: 'on the same server that takes the orders' },
      ],
    },
    {
      type: 'group', id: 'answer', badge: 3, title: 'The answer: revenue by month', sub: 'the six columns added up, EUR thousands', tone: 'serve', children: [
        {
          type: 'plot', id: 'by-month', compact: true, x: { labels: LETTERS }, y: { min: 0, max: 300, step: 50 },
          series: [{ kind: 'bar', points: months.map(({ month, total }) => [month - 1, Math.round(total / 1000)]) }],
        },
      ],
    },
  ],
  edges: [
    { from: 't-items.order_id', to: 't-orders.order_id' },
    { from: 't-items.product_id', to: 't-products.product_id' },
  ],
})
