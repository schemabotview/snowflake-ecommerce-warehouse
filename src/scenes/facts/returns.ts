import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { rowsOf } from '../recorded'
import { factsTree } from './tree'
import session from '../../../spine/facts/03-returns/session.txt?raw'
import sql from '../../../spine/facts/03-returns/project/dbt/models/marts/fct_returns.sql?raw'

// §9.3 — Returns: each returned line joined to the order line it undoes (recorded on Snowflake).
const reasons = rowsOf(session, 'REASON', 4, 0, 6)
const returned = reasons.reduce((a, r) => a + Number(r[1]), 0)
const matched = reasons.reduce((a, r) => a + Number(r[2]), 0)

export const factsReturns: SceneModel = ideFrame2({
  model: 'TODO',
  tree: factsTree('queries/returns.sql', 'dbt/models/marts/fct_returns.sql', ['dbt/models/marts/fct_returns.sql', 'queries/returns.sql']),
  editor: { file: 'dbt/models/marts/fct_returns.sql', code: sql },
  session,
  keep: ['1 of 1 OK created', ['| REASON', '+-----------------------------------------------------+']],
  side: [
    {
      type: 'group', id: 'join', badge: 1, title: 'A return points back at what it undoes', tone: 'infra', children: [
        { type: 'item', id: 'r-ret', icon: 'package', title: 'stg_returns', sub: 'the returns CSV, Course 5' },
        { type: 'item', id: 'r-line', icon: 'table', title: 'fct_order_lines', sub: 'same order, same product' },
        { type: 'item', id: 'r-fact', icon: 'layers', title: 'fct_returns', sub: 'refund = the line’s amount in EUR' },
      ],
    },
    {
      type: 'group', id: 'why', badge: 2, title: 'Why customers sent things back', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'rs', columns: ['reason', 'returns', 'matched', 'refund €'], rows: reasons },
      ],
    },
  ],
  edges: [
    { from: 'r-ret', to: 'r-line' },
    { from: 'r-line', to: 'r-fact' },
  ],
})
