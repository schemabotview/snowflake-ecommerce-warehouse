import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { rowsOf } from '../recorded'
import { startTree } from './tree'
import session from '../../../spine/start/01-shop-db/session.txt?raw'
import sql from '../../../spine/start/01-shop-db/project/queries/shop_tables.sql?raw'

// §3.1 — Shopwave's database: the four tables the warehouse will load first, in the shop's own
// PostgreSQL 18.6 (runs locally). The side pane is the shop's ER diagram, with the run's row counts.
const table = rowsOf(session, 'table_name', 3)
const rows = Object.fromEntries(table.map(([t, n, size]) => [t, `${n} rows · ${size}`]))

export const startShopDb: SceneModel = ideFrame({
  tree: startTree('queries/shop_tables.sql', 'queries/shop_tables.sql', ['shop', 'queries/shop_tables.sql']),
  editor: { file: 'queries/shop_tables.sql', code: sql },
  session,
  side: [
    {
      type: 'group', id: 'er', badge: 1, title: 'The shop’s schema', sub: 'normalised: each fact once, joined by keys', icon: 'postgresql', tone: 'source', dir: 'grid', cols: 2, children: [
        { type: 'item', id: 'e-customers', icon: 'users', title: 'customers', sub: rows.customers },
        { type: 'item', id: 'e-orders', icon: 'card', title: 'orders', sub: rows.orders },
        { type: 'item', id: 'e-products', icon: 'package', title: 'products', sub: rows.products },
        { type: 'item', id: 'e-items', icon: 'table', title: 'order_items', sub: rows.order_items },
      ],
    },
    {
      type: 'group', id: 'next', badge: 2, title: 'What the warehouse will take', tone: 'neutral', children: [
        { type: 'table', id: 'plan', columns: ['table', 'into', 'course'], rows: [
          { cells: ['products', 'RAW.SHOPWAVE', '3'], tone: 'serve' },
          ['orders, order_items', 'RAW.SHOPWAVE', '5'],
          ['customers', 'RAW.SHOPWAVE', '5'],
        ] },
      ],
    },
    {
      type: 'group', id: 'sizes', badge: 3, title: 'Rows per table', sub: 'thousands, from the run', tone: 'source', children: [
        { type: 'plot', id: 'rows-plot', compact: true, x: { labels: table.map(([t]) => t) }, y: { min: 0, max: 40, step: 10 },
          series: [{ kind: 'bar', points: table.map(([, n], i) => [i, Number(n) / 1000]) }] },
      ],
    },
    { type: 'note', id: 'stays', tone: 'neutral', text: 'The shop keeps running on PostgreSQL: the warehouse copies its data, it never replaces it.' },
  ],
  edges: [
    { from: 'e-orders', to: 'e-customers', label: 'customer_id' },
    { from: 'e-items', to: 'e-orders', label: 'order_id' },
    { from: 'e-items', to: 'e-products', label: 'product_id' },
  ],
})
