import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { cell } from '../recorded'
import { performTree } from './tree'
import session from '../../../spine/perform/06-acceleration/session.txt?raw'
import sql from '../../../spine/perform/06-acceleration/project/queries/acceleration.sql?raw'

// §10.6 — Query acceleration (recorded on Snowflake): the service's own estimate for a full scan of
// the clicks. What makes a query eligible is doc-cited (Snowflake docs, "Using the Query
// Acceleration Service": large scans with filters or aggregation, on enough partitions).
const n = (column: string) => cell(session, column, 0, column === 'STATUS' ? 1 : 0)  // the first 'status' table is ALTER SESSION's

export const performAcceleration: SceneModel = ideFrame2({
  model: 'Query acceleration: borrow compute for one big scan',
  tree: performTree('queries/acceleration.sql', 'queries/acceleration.sql'),
  editor: { file: 'queries/acceleration.sql', code: sql },
  session,
  keep: [['| CAMPAIGN', '| retarget'], ['| STATUS', '+-------------------------------------+']],
  side: [
    {
      type: 'group', id: 'how', badge: 1, title: 'What the service does', tone: 'infra', children: [
        { type: 'item', id: 'a-wh', icon: 'cpu', title: 'Your warehouse runs the query', sub: 'its size fixed: XS, S…' },
        { type: 'item', id: 'a-off', icon: 'cloud', title: 'Part of a big scan goes to shared compute', sub: 'many servers, for seconds' },
        { type: 'item', id: 'a-cap', icon: 'gauge', title: 'Up to a scale factor × the warehouse', sub: 'billed per second it is used' },
      ],
    },
    {
      type: 'group', id: 'est', badge: 2, title: 'Its estimate for this query', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'e', columns: ['status', 'seconds', 'scale factor'], rows: [{ cells: [n('STATUS'), n('SECONDS'), n('SCALE_FACTOR')], tone: 'consume' }] },
      ],
    },
  ],
  edges: [
    { from: 'a-wh', to: 'a-off' },
    { from: 'a-off', to: 'a-cap' },
  ],
})
