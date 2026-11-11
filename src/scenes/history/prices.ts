import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { rowsOf } from '../recorded'
import { historyTree } from './tree'
import session from '../../../spine/history/03-prices/session.txt?raw'
import sql from '../../../spine/history/03-prices/project/dbt/models/marts/core/dim_product.sql?raw'

// §8.3 — Price history: dim_product versioned straight from the shop's price log (recorded on Snowflake).
const versions = rowsOf(session, 'PRODUCT_ID', 5, 0, 6)

export const historyPrices: SceneModel = ideFrame2({
  model: 'A price log: history the source already keeps',
  tree: historyTree('queries/price_history.sql', 'dbt/models/marts/core/dim_product.sql', ['load/product_prices.sql', 'dbt/models/staging/stg_product_prices.sql', 'dbt/models/marts/core/dim_product.sql', 'queries/price_history.sql']),
  editor: { file: 'dbt/models/marts/core/dim_product.sql', code: sql },
  session,
  keep: ['$ bash load/as-loader.sh -f load/product_prices.sql', '$ dbt run --select stg_product_prices dim_product', 'Done. PASS=2', ['| PRODUCT_ID', '| 10         | Merida Desk Lamp  | 55.50']],
  side: [
    {
      type: 'group', id: 'two', badge: 1, title: 'Where history comes from', tone: 'infra', dir: 'row', children: [
        { type: 'item', id: 'h-snap', icon: 'clock', title: 'Customers', sub: 'the source keeps only now: snapshot it', stack: true },
        { type: 'item', id: 'h-log', icon: 'file', title: 'Prices', sub: 'the source keeps a log: model it', stack: true, tone: 'serve' },
      ],
    },
    { type: 'table', title: 'Products priced three ways in 2026 (from the run)', id: 'v', columns: ['product', 'EUR', 'from', 'to'], rows: versions.map(([, p, e, f, t]) => [p, e, ((d: string) => (d.startsWith('9999') ? '9999' : d.slice(5)))(f), ((d: string) => (d.startsWith('9999') ? '9999' : d.slice(5)))(t)]) },
  ],
  edges: [{ from: 'h-log', to: 'v' }],
})
