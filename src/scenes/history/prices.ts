import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { rowsOf } from '../recorded'
import { historyTree } from './tree'
import session from '../../../spine/history/03-prices/session.txt?raw'
import sql from '../../../spine/history/03-prices/project/dbt/models/marts/core/dim_product.sql?raw'

// §8.3 — Price history: dim_product versioned straight from the shop's price log (recorded on Snowflake).
const versions = rowsOf(session, 'PRODUCT_ID', 5, 0, 6)

export const historyPrices: SceneModel = ideFrame2({
  model: 'TODO',
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
    {
      type: 'group', id: 'rows', badge: 2, title: 'Products priced three ways in 2026', sub: 'from the run', tone: 'serve', children: [
        { type: 'table', id: 'v', columns: ['id', 'product', 'EUR', 'from', 'to'], rows: versions },
      ],
    },
    {
      type: 'group', id: 'rule', badge: 3, title: 'The rule every version keeps', tone: 'infra', children: [
        { type: 'table', id: 'r', columns: ['', 'meaning'], rows: [
          ['valid_from ≤ day < valid_to', 'the version in force that day'],
          ['valid_to = next valid_from', 'no gaps, no overlaps'],
          { cells: ['valid_to = 9999-12-31', 'the current price'], tone: 'serve' },
        ] },
      ],
    },
  ],
  edges: [],
})
