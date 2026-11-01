import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf } from '../ide'
import { cell, rowsOf } from '../recorded'
import { factsTree } from './tree'
import session from '../../../spine/facts/06-monthly/session.txt?raw'
import sql from '../../../spine/facts/06-monthly/project/dbt/models/marts/fct_customer_monthly.sql?raw'

// §9.6 — A periodic snapshot: every customer, every month, with the tier from 8.2's snapshot
// (recorded on Snowflake). Customer 81 is the one Course 8 followed.
const total = cell(session, 'ROWS_IN_TABLE')
const months = rowsOf(session, 'MONTH', 3, 0, 6)

export const factsMonthly: SceneModel = ideFrame({
  tree: factsTree('queries/monthly.sql', 'dbt/models/marts/fct_customer_monthly.sql', ['dbt/models/marts/fct_customer_monthly.sql', 'queries/monthly.sql']),
  editor: { file: 'dbt/models/marts/fct_customer_monthly.sql', code: sql, show: [[1, 2], [lineOf(sql, 'orders as ('), lineOf(sql, 'dbt_valid_to')]] },
  session,
  keep: ['1 of 1 OK created', ['| ROWS_IN_TABLE', '| 24000'], ['| MONTH', '| 2026-03']],
  side: [
    {
      type: 'group', id: 'grid', badge: 1, title: 'Every customer × every month', tone: 'infra', children: [
        { type: 'item', id: 'g-m', icon: 'clock', title: 'months', sub: 'from dim_date' },
        { type: 'item', id: 'g-c', icon: 'users', title: 'CROSS JOIN customers', sub: 'a row even when nothing happened' },
        { type: 'item', id: 'g-t', icon: 'layers', title: 'the tier at month end', sub: 'the snapshot version valid that day (8.2)' },
        { type: 'item', id: 'g-n', icon: 'table', title: `${total} rows`, sub: 'from the run' },
      ],
    },
    {
      type: 'group', id: 'c81', badge: 2, title: 'Customer 81, month by month', sub: 'from the run', tone: 'serve', children: [
        { type: 'table', id: 'm', columns: ['month', 'orders', 'tier'], rows: months },
      ],
    },
    { type: 'note', id: 'zero', tone: 'neutral', text: 'A missing row and a zero mean different things: a periodic snapshot writes a row for every customer, every month, ordered or not.' },
  ],
  edges: [
    { from: 'g-m', to: 'g-c' },
    { from: 'g-c', to: 'g-t' },
    { from: 'g-t', to: 'g-n' },
  ],
})
