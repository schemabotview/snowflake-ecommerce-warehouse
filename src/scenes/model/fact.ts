import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { cell } from '../recorded'
import { star } from '../star'
import { modelTree } from './tree'
import session from '../../../spine/model/04-fact/session.txt?raw'
import sql from '../../../spine/model/04-fact/project/model/fct_order_lines.sql?raw'

// §6.4 — The fact table, by hand (recorded on Snowflake). The star frame's first appearance.
const s = star({ stage: 'natural', dims: [], lit: ['qty', 'unit_price', 'amount_eur'] })
const rows = cell(session, 'FACT_ROWS'), lines = cell(session, 'ORDER_LINES'), raw = cell(session, 'RAW_LINES')

export const modelFact: SceneModel = ideFrame2({
  model: 'The fact: one row per order line, pointers and measures',
  tree: modelTree('queries/fact_check.sql', 'model/fct_order_lines.sql', ['model/fct_order_lines.sql', 'queries/fact_check.sql']),
  editor: { file: 'model/fct_order_lines.sql', code: sql },
  session,
  keep: ['$ bash model/as-transformer.sh -f model/fct_order_lines.sql', 'Table FCT_ORDER_LINES successfully created', '$ bash model/as-transformer.sh -f queries/fact_check.sql', ['| FACT_ROWS', '| 35043']],
  side: [
    s.node,
    {
      type: 'group', id: 'check', badge: 1, title: 'Does the grain hold?', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'counts', columns: ['fact rows', 'distinct order lines', 'lines in RAW'], rows: [[rows, lines, raw]] },
      ],
    },
  ],
  edges: s.edges,
})
