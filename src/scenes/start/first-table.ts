import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { rowsOf } from '../recorded'
import { startTree } from './tree'
import session from '../../../spine/start/03-first-table/session.txt?raw'
import sql from '../../../spine/start/03-first-table/project/load/products.sql?raw'

// §3.3 — A first table and query: products exported from PostgreSQL, PUT to the table's own stage,
// COPY'd in, asked (recorded on Snowflake).
const categories = rowsOf(session, 'CATEGORY', 3, 0, 6) // six categories (shopwave_gen)

export const startFirstTable: SceneModel = ideFrame({
  tree: startTree('queries/categories.sql', 'load/products.sql', ['load/products.sql', 'queries/categories.sql'], { 'exports/': 'products.csv' }),
  editor: { file: 'load/products.sql', code: sql },
  session,
  keep: ['$ mkdir', '$ psql', 'COPY 50', '$ snow sql -f load/products.sql', '| products.csv.gz | LOADED', '$ snow sql -f queries/categories.sql', ['| CATEGORY', '| beauty']],
  side: [
    {
      type: 'group', id: 'trip', badge: 1, title: 'The round trip', sub: 'every query takes it', tone: 'infra', children: [
        { type: 'item', id: 'r-client', icon: 'terminal', title: 'snow sends SQL', sub: 'and the file, for PUT' },
        { type: 'item', id: 'r-services', icon: 'cloud', title: 'Cloud services plan it', sub: 'COPY, then SELECT' },
        { type: 'item', id: 'r-wh', icon: 'cpu', title: 'WH_LOAD runs it', sub: 'resumed for the work, then sleeps' },
        { type: 'item', id: 'r-storage', icon: 'disk', title: 'Storage keeps the table', sub: 'RAW.SHOPWAVE.PRODUCTS' },
      ],
    },
    {
      type: 'group', id: 'answer', badge: 2, title: 'The first answer', sub: 'queries/categories.sql, from the run', tone: 'serve', children: [
        { type: 'table', id: 'cats', columns: ['category', 'products', 'avg price'], rows: categories },
      ],
    },
    { type: 'note', id: 'stage', tone: 'neutral', text: '@%PRODUCTS is the table’s own stage: enough for one file. Course 5 builds RAW.SHOPWAVE.LANDING, one stage for every source.' },
  ],
  edges: [
    { from: 'r-client', to: 'r-services' },
    { from: 'r-services', to: 'r-wh' },
    { from: 'r-wh', to: 'r-storage' },
  ],
})
