import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { rowsOf } from '../recorded'
import { star } from '../star'
import { historyTree } from './tree'
import session from '../../../spine/history/06-currency/session.txt?raw'
import sql from '../../../spine/history/06-currency/project/dbt/models/marts/core/fct_payments.sql?raw'

// §8.6 — Currency: dim_currency, payments in euros at the day's rate (recorded on Snowflake).
const s = star({ stage: 'roles', dims: ['date', 'customer', 'product', 'currency'] })
const sums = rowsOf(session, 'CODE', 4, 0, 5)

export const historyCurrency: SceneModel = ideFrame({
  tree: historyTree('queries/currency.sql', 'dbt/models/marts/core/fct_payments.sql', ['dbt/models/marts/core/dim_currency.sql', 'dbt/models/marts/core/fct_payments.sql', 'queries/currency.sql']),
  editor: { file: 'dbt/models/marts/core/fct_payments.sql', code: sql },
  session,
  side: [
    s.node,
    {
      type: 'group', id: 'sums', badge: 1, title: 'Payments by currency', sub: 'from the run: the last row is the total', tone: 'serve', children: [
        { type: 'table', id: 'cur', columns: ['currency', 'payments', 'amount', 'in EUR'], rows: sums },
      ],
    },
    { type: 'note', id: 'never', tone: 'consume', text: 'The total of “amount” adds pounds to rupees: meaningless. Only amount_eur may be summed across currencies.' },
  ],
  edges: s.edges,
})
