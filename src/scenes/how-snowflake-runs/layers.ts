import type { SceneModel } from '@graphlearning/graphl-flow'
import { terminal } from '../ide'
import session from '../../../spine/how-snowflake-runs/01-layers/session.txt?raw'

// §2.1 — ◆ three layers. A new account asked what it holds, before any warehouse has run: storage,
// compute and cloud services are separate, each scaled on its own. Recorded on Snowflake (the
// architecture itself is doc-cited: docs.snowflake.com/en/user-guide/intro-key-concepts).
export const howLayers: SceneModel = {
  title: 'How Snowflake is built: three layers, scaled separately',
  sub: 'Cloud services plan and govern; warehouses compute; storage keeps every table in cloud object storage',
  dir: 'row',
  nodes: [
    {
      type: 'group', id: 'layers', bare: true, children: [
        {
          type: 'group', id: 'services', badge: 1, title: 'Cloud services', sub: 'always on: no warehouse needed', icon: 'cloud', tone: 'serve', dir: 'row', children: [
            { type: 'item', id: 'sv-auth', icon: 'key', title: 'Log in', sub: 'users, roles, keys' },
            { type: 'item', id: 'sv-plan', icon: 'workflow', title: 'Parse, optimise', sub: 'every query planned' },
            { type: 'item', id: 'sv-meta', icon: 'search', title: 'Metadata', sub: 'SHOW, row counts, min / max' },
          ],
        },
        {
          type: 'group', id: 'compute', badge: 2, title: 'Compute: virtual warehouses', sub: 'billed per second, only while running', icon: 'cpu', tone: 'infra', dir: 'row', children: [
            { type: 'item', id: 'cp-wh', icon: 'cpu', title: 'A warehouse', sub: 'a cluster of servers, sized XS to 6XL' },
            { type: 'item', id: 'cp-many', icon: 'boxes', title: 'Many warehouses', sub: 'one per team: none slows another' },
          ],
        },
        {
          type: 'group', id: 'storage', badge: 3, title: 'Storage', sub: 'billed per terabyte stored', icon: 'disk', tone: 'store', dir: 'row', children: [
            { type: 'item', id: 'st-tables', icon: 'table', title: 'Tables', sub: 'columnar micro-partitions' },
            { type: 'item', id: 'st-cloud', icon: 's3', title: 'Cloud object storage', sub: 'here: AWS, us-east-1' },
          ],
        },
      ],
    },
    {
      type: 'group', id: 'proof', title: 'A new account, asked', icon: 'terminal', tone: 'neutral', children: [
        { type: 'code', id: 'out', terminal: true, filename: 'terminal — shopwave-dw', code: terminal(session) },
      ],
    },
  ],
  edges: [
    { from: 'services', to: 'compute', label: 'sends the plan' },
    { from: 'compute', to: 'storage', label: 'reads, writes' },
  ],
}
