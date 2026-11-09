import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { rowsOf } from '../recorded'
import { star } from '../star'
import { modelTree } from './tree'
import session from '../../../spine/model/06-keys/session.txt?raw'
import sql from '../../../spine/model/06-keys/project/model/fct_order_lines.sql?raw'

// §6.6 — Surrogate keys: the dimensions get the warehouse's own keys, the fact points at them
// (recorded on Snowflake).
const s = star({ stage: 'keys', dims: ['date', 'customer', 'product'], lit: ['customer_key', 'product_key', 'order_date_key'] })
const check = rowsOf(session, 'FACT_ROWS', 4)

export const modelKeys: SceneModel = ideFrame2({
  model: 'TODO',
  tree: modelTree('queries/keys.sql', 'model/fct_order_lines.sql', ['model/dim_customer.sql', 'model/dim_product.sql', 'model/fct_order_lines.sql', 'queries/keys.sql']),
  editor: { file: 'model/fct_order_lines.sql', code: sql, ...view(sql, 'CREATE OR REPLACE', undefined, 1) },
  session,
  keep: ['$ bash model/as-transformer.sh -f model/dim_customer.sql', '$ bash model/as-transformer.sh -f model/dim_product.sql', '$ bash model/as-transformer.sh -f model/fct_order_lines.sql', '$ bash model/as-transformer.sh -f queries/keys.sql', ['| FACT_ROWS', '| 35043']],
  side: [
    s.node,
    {
      type: 'group', id: 'why', badge: 1, title: 'Natural key or surrogate key', tone: 'infra', children: [
        { type: 'table', id: 'compare', columns: ['', 'customer_id', 'customer_key'], rows: [
          ['made by', 'the shop', 'the warehouse'],
          ['one per', 'customer', 'version (8)'],
          { cells: ['ids renumbered', 'joins break', 'no change'], tone: 'serve' },
        ] },
      ],
    },
    {
      type: 'group', id: 'orphans', badge: 2, title: 'Every fact row finds its dimensions', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'found', columns: ['rows', 'date', 'customer', 'product'], rows: check },
      ],
    },
  ],
  edges: s.edges,
})
