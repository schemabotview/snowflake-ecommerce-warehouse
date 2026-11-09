import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { rowsOf } from '../recorded'
import { startTree } from './tree'
import session from '../../../spine/start/01-shop-db/session.txt?raw'
import sql from '../../../spine/start/01-shop-db/project/queries/shop_tables.sql?raw'

// §3.1 — Shopwave's database: the four tables the warehouse will load first, in the shop's own
// PostgreSQL 18.6 (runs locally). The side pane is the shop's ER diagram, with the run's row counts.
const table = rowsOf(session, 'table_name', 3)
const rows = Object.fromEntries(table.map(([t, n, size]) => [t, `${n} rows · ${size}`]))

export const startShopDb: SceneModel = ideFrame2({
  model: 'The shop: normalised, joined by keys',
  tree: startTree('queries/shop_tables.sql', 'queries/shop_tables.sql', ['shop', 'queries/shop_tables.sql']),
  editor: { file: 'queries/shop_tables.sql', code: sql },
  session,
  side: [
    {
      type: 'group', id: 'er', badge: 1, title: 'The shop’s schema', sub: 'normalised: each fact once, joined by keys', icon: 'postgresql', tone: 'source', dir: 'grid', cols: 2, children: [
        { type: 'item', id: 'e-customers', icon: 'users', title: 'customers', sub: rows.customers.split(' · ')[0] },
        { type: 'item', id: 'e-orders', icon: 'card', title: 'orders', sub: rows.orders.split(' · ')[0] },
        { type: 'item', id: 'e-products', icon: 'package', title: 'products', sub: rows.products.split(' · ')[0] },
        { type: 'item', id: 'e-items', icon: 'table', title: 'order_items', sub: rows.order_items.split(' · ')[0] },
      ],
    },
    {
      type: 'group', id: 'next', badge: 2, title: 'Into RAW.SHOPWAVE, as they are', tone: 'neutral', children: [
        { type: 'table', id: 'plan', columns: ['table', 'course'], rows: [
          { cells: ['products', '3'], tone: 'serve' },
          ['orders, items', '5'],
          ['customers', '5'],
        ] },
      ],
    },
  ],
  edges: [
    { from: 'e-orders', to: 'e-customers' },
    { from: 'e-items', to: 'e-orders', label: 'order_id' },
    { from: 'e-items', to: 'e-products' },
  ],
})
