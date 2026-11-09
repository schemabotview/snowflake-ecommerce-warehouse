import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { cell, rowsOf } from '../recorded'
import { historyTree } from './tree'
import session from '../../../spine/history/07-streams/session.txt?raw'
import sql from '../../../spine/history/07-streams/project/load/order_changes.sql?raw'

// §8.7 — Streams: change capture on the shop's change feed (recorded on Snowflake).
const changes = rowsOf(session, 'ACTION', 3, 0, 2)
const left = cell(session, 'LEFT_IN_STREAM')

export const historyStreams: SceneModel = ideFrame2({
  model: 'TODO',
  tree: historyTree('load/order_changes.sql', 'load/order_changes.sql', ['setup/stream_grants.sql', 'load/order_changes.sql']),
  editor: { file: 'load/order_changes.sql', code: sql, ...view(sql, 'CREATE TABLE IF NOT EXISTS ORDER_CHANGES', undefined, 0) },
  session,
  keep: ['$ bash load/as-loader.sh -f load/order_changes.sql', '| 7     | 1976', ['| ACTION', '| INSERT | shipped'], '| 0              |'],
  side: [
    {
      type: 'group', id: 'how', badge: 1, title: 'A stream: an offset on a table', tone: 'infra', children: [
        { type: 'item', id: 'st-table', icon: 'table', title: 'ORDER_CHANGES', sub: 'rows inserted by COPY' },
        { type: 'item', id: 'st-stream', icon: 'stream', title: 'ORDER_CHANGES_STREAM', sub: 'what changed since the offset' },
        { type: 'item', id: 'st-consume', icon: 'check', title: 'INSERT … SELECT FROM the stream', sub: 'consumes it: the offset moves on' },
      ],
    },
    {
      type: 'group', id: 'seen', badge: 2, title: 'What the stream held', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'c', columns: ['action', 'status', 'changes'], rows: changes },
        { type: 'table', id: 'after', columns: ['left in the stream after the INSERT'], rows: [[left]] },
      ],
    },
    {
      type: 'group', id: 'meta', badge: 3, title: 'What a stream adds to each row', tone: 'infra', children: [
        { type: 'table', id: 'm', columns: ['column', 'says'], rows: [
          ['METADATA$ACTION', 'INSERT or DELETE'], ['METADATA$ISUPDATE', 'part of an UPDATE?'], ['METADATA$ROW_ID', 'which row, for good'],
        ] },
      ],
    },
  ],
  edges: [
    { from: 'st-table', to: 'st-stream' },
    { from: 'st-stream', to: 'st-consume' },
  ],
})
