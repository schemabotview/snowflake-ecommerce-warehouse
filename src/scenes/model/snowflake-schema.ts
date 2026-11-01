import type { SceneModel } from '@graphlearning/graphl-flow'
import { terminal } from '../ide'
import { rowsOf } from '../recorded'
import session from '../../../spine/model/07-snowflake-schema/session.txt?raw'

// §6.7 — ◆ star vs snowflake schema: category split out of the product dimension into its own
// (temporary) table, the same question asked of both (recorded on Snowflake).
const answers = rowsOf(session, 'MODEL', 3, 0, 2)
const t = (id: string, title: string, rows: string[], tone: 'serve' | 'store' | 'consume') => ({ type: 'table' as const, id, title, tone, rows: rows.map((r) => ({ id: r, cells: [r] })) })

export const modelSnowflakeSchema: SceneModel = {
  title: 'Star or snowflake: where does a category live?',
  sub: 'The product dimension kept whole, or normalised into a category table',
  dir: 'row',
  nodes: [
    {
      type: 'group', id: 'left', bare: true, children: [
        {
          type: 'group', id: 'models', bare: true, dir: 'row', children: [
            {
              type: 'group', id: 'm-star', badge: 1, title: 'Star', sub: 'category is a column of dim_product', tone: 'serve', dir: 'row', children: [
                t('s-fact', 'fct_order_lines', ['product_key', 'amount_eur'], 'serve'),
                t('s-prod', 'dim_product', ['product_key', 'name', 'category'], 'store'),
              ],
            },
            {
              type: 'group', id: 'm-snow', badge: 2, title: 'Snowflake', sub: 'category is its own table', tone: 'consume', dir: 'row', children: [
                t('f-fact', 'fct_order_lines', ['product_key', 'amount_eur'], 'serve'),
                t('f-prod', 'dim_product_sf', ['product_key', 'name', 'category_key'], 'store'),
                t('f-cat', 'dim_category', ['category_key', 'category'], 'consume'),
              ],
            },
          ],
        },
        {
          type: 'group', id: 'answers', badge: 3, title: 'Revenue by category, both ways', sub: 'from the run', tone: 'neutral', children: [
            { type: 'table', id: 'same', columns: ['model', 'categories', 'EUR'], rows: answers },
          ],
        },
        {
          type: 'group', id: 'trade', badge: 4, title: 'The trade', tone: 'infra', children: [
            { type: 'table', id: 'tradeoff', columns: ['', 'star', 'snowflake'], rows: [
              ['joins for “by category”', '1', '2'], ['category name stored', 'once per product', 'once'],
              { cells: ['what a column store charges for repetition', 'almost nothing', '—'], tone: 'serve' },
            ] },
          ],
        },
      ],
    },
    {
      type: 'group', id: 'proof', title: 'The run', icon: 'terminal', tone: 'neutral', children: [
        { type: 'code', id: 'out', terminal: true, filename: 'terminal — shopwave-dw', code: terminal(session) },
      ],
    },
  ],
  edges: [
    { from: 's-fact.product_key', to: 's-prod.product_key' },
    { from: 'f-fact.product_key', to: 'f-prod.product_key' },
    { from: 'f-prod.category_key', to: 'f-cat.category_key' },
  ],
}
