import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { cell } from '../recorded'
import { performTree } from './tree'
import session from '../../../spine/perform/02-pruning/session.txt?raw'
import sql from '../../../spine/perform/02-pruning/project/queries/pruning.sql?raw'

// §10.2 — Pruning: November's order lines, and the partitions Snowflake had to read (recorded on
// Snowflake). A table written by an XS warehouse is 8 partitions, each spanning the whole year.
const n = (column: string) => cell(session, column)

export const performPruning: SceneModel = ideFrame2({
  model: 'TODO',
  tree: performTree('queries/pruning.sql', 'queries/pruning.sql'),
  editor: { file: 'queries/pruning.sql', code: sql },
  session,
  keep: [['| PARTITIONS', '| 8 '], ['| NOVEMBER_EUR', '| 322549'], ['| SCANNED', '+-----------------+']],
  side: [
    {
      type: 'group', id: 'how', badge: 1, title: 'How Snowflake skips a partition', tone: 'infra', children: [
        { type: 'item', id: 'p-meta', icon: 'database', title: 'Each partition’s min and max, per column', sub: 'kept as metadata when it is written' },
        { type: 'item', id: 'p-ask', icon: 'filter', title: 'WHERE order_date_key in November', sub: 'compared with every partition’s range' },
        { type: 'item', id: 'p-skip', icon: 'check', title: 'A range that cannot hold November', sub: 'is never read' },
      ],
    },
    {
      type: 'group', id: 'layout', badge: 2, title: 'FCT_ORDER_LINES, by order date', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'l', columns: ['partitions', 'overlapping each', 'depth'], rows: [[n('PARTITIONS'), n('OVERLAPS'), n('DEPTH')]] },
        { type: 'table', id: 's', columns: ['November: partitions read', 'of'], rows: [{ cells: [n('SCANNED'), n('TOTAL')], tone: 'consume' }] },
      ],
    },
  ],
  edges: [
    { from: 'p-meta', to: 'p-ask' },
    { from: 'p-ask', to: 'p-skip' },
  ],
})
