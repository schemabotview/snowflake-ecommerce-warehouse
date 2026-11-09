import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { isRecorded, rowsOf, PENDING } from '../recorded'
import { performTree } from './tree'
import session from '../../../spine/perform/04-scale/session.txt?raw'
import code from '../../../spine/perform/04-scale/project/perform/black_friday.py?raw'

// §10.4 — Scale up vs scale out (recorded on Snowflake): WH_TRANSFORM one size up, WH_BI allowed
// three clusters, then 96 dashboard queries at once. The clusters table is the script's own print.
const sizes = rowsOf(session, 'name', 4, 0, 3)
const clusters = isRecorded(session)
  ? [...session.matchAll(/^\s+(\d+)\s+(\d+)\s+([\d.]+) s$/gm)].map(([, c, q, w]) => [c, q, `${w} s`])
  : [[PENDING, PENDING, PENDING]]
if (isRecorded(session) && !clusters.length) throw new Error('scale.ts: no cluster rows in the recorded session')

export const performScale: SceneModel = ideFrame2({
  model: 'TODO',
  tree: performTree('perform/black_friday.py', 'perform/black_friday.py', ['setup/perform_grants.sql', 'setup/scale.sql', 'perform/black_friday.py']),
  editor: { file: 'perform/black_friday.py', code, show: [[1, 5], [9, 9], [25, 38]] },
  session,
  keep: [['| name', '| WH_TRANSFORM'], ['$ python perform/black_friday.py', '96 dashboard'], ['cluster  queries', '      2 ']],
  side: [
    {
      type: 'group', id: 'two', badge: 1, title: 'Bigger, or more', tone: 'infra', dir: 'row', children: [
        {
          type: 'group', id: 'up', title: 'Scale up: a bigger size', tone: 'store', children: [
            { type: 'item', id: 'u-what', icon: 'cpu', title: 'WH_TRANSFORM: XS → S', sub: 'twice the compute, and twice the credits per hour' },
            { type: 'item', id: 'u-for', icon: 'zap', title: 'For one heavy job', sub: 'dbt’s biggest models finish sooner' },
          ],
        },
        {
          type: 'group', id: 'out', title: 'Scale out: more clusters', tone: 'serve', children: [
            { type: 'item', id: 'o-what', icon: 'boxes', title: 'WH_BI: 1 to 3 clusters', sub: 'each XS; extra ones only while needed' },
            { type: 'item', id: 'o-for', icon: 'users', title: 'For many queries at once', sub: 'a queue starts a cluster' },
          ],
        },
      ],
    },
    {
      type: 'group', id: 'sizes', badge: 2, title: 'The warehouses now', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'w', columns: ['warehouse', 'size', 'min', 'max'], rows: sizes },
      ],
    },
    {
      type: 'group', id: 'bf', badge: 3, title: 'Black Friday: 96 dashboard loads at once', sub: 'from the run', tone: 'serve', children: [
        { type: 'table', id: 'c', columns: ['cluster', 'queries', 'longest wait'], rows: clusters },
      ],
    },
  ],
  edges: [
    { from: 'u-what', to: 'u-for' },
    { from: 'o-what', to: 'o-for' },
  ],
})
