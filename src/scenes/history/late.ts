import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { rowsOf } from '../recorded'
import { historyTree } from './tree'
import session from '../../../spine/history/05-late/session.txt?raw'
import sql from '../../../spine/history/05-late/project/queries/late.sql?raw'

// §8.5 — Late-arriving facts: clicks that land days after they happened (planted: 1% up to 3 days;
// recorded on Snowflake). The inferred member is doc-cited (Kimball & Ross, ch. 19).
const late = rowsOf(session, 'DAYS_LATE', 2, 0, 4)

export const historyLate: SceneModel = ideFrame2({
  model: 'TODO',
  tree: historyTree('queries/late.sql', 'queries/late.sql'),
  editor: { file: 'queries/late.sql', code: sql },
  session,
  keep: ['$ bash model/as-transformer.sh', ['| DAYS_LATE', '| 3 ']],
  side: [
    {
      type: 'group', id: 'when', badge: 1, title: 'Two dates on every event', tone: 'infra', children: [
        { type: 'item', id: 'w-happen', icon: 'clock', title: 'When it happened', sub: 'event_ts: decides the day it counts for' },
        { type: 'item', id: 'w-arrive', icon: 'file', title: 'When it arrived', sub: 'the file’s day: decides when we learn of it' },
        { type: 'item', id: 'w-right', icon: 'check', title: 'It lands in its own day', sub: 'and that day’s numbers change, after the fact' },
      ],
    },
    {
      type: 'group', id: 'counts', badge: 2, title: 'Clicks by days late', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'l', columns: ['days late', 'events'], rows: late },
      ],
    },
  ],
  edges: [
    { from: 'w-happen', to: 'w-arrive', label: 'up to 3 days' },
    { from: 'w-arrive', to: 'w-right' },
  ],
})
