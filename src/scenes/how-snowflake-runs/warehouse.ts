import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { howTree } from './tree'
import session from '../../../spine/how-snowflake-runs/02-warehouse/session.txt?raw'
import sql from '../../../spine/how-snowflake-runs/02-warehouse/project/setup/warehouses.sql?raw'

// §2.2 — Virtual warehouses and credits. WH_LOAD is created suspended; a query that needs compute
// resumes it (recorded on Snowflake). The side pane's rates are doc-cited
// (docs.snowflake.com/en/user-guide/warehouses-overview, standard warehouses).
const SIZES: [string, number][] = [['X-Small', 1], ['Small', 2], ['Medium', 4], ['Large', 8], ['X-Large', 16], ['2X-Large', 32]]

export const howWarehouse: SceneModel = ideFrame({
  tree: howTree('queries/wake.sql', 'setup/warehouses.sql', ['setup/warehouses.sql', 'queries/wake.sql']),
  editor: { file: 'setup/warehouses.sql', code: sql },
  session,
  side: [
    {
      type: 'group', id: 'states', badge: 1, title: 'A warehouse’s life', sub: 'billing runs only between resume and suspend', tone: 'infra', children: [
        { type: 'item', id: 'w-suspended', icon: 'power', title: 'SUSPENDED', sub: 'created this way: costs nothing' },
        { type: 'item', id: 'w-started', icon: 'cpu', title: 'STARTED', sub: 'a query arrived: billed per second, at least 60' },
        { type: 'item', id: 'w-idle', icon: 'timer', title: 'idle for AUTO_SUSPEND', sub: '60 seconds here, still billed' },
      ],
    },
    {
      type: 'group', id: 'rates', badge: 2, title: 'Size sets the rate', sub: 'credits per hour, standard warehouses (docs)', tone: 'neutral', children: [
        { type: 'table', id: 'sizes', columns: ['size', 'credits / hour'], rows: SIZES.map(([s, c]) => ({ cells: [s, c], tone: s === 'X-Small' ? 'serve' as const : undefined })) },
      ],
    },
    { type: 'note', id: 'double', tone: 'neutral', text: 'Each size up doubles the servers and the rate: twice the credits per hour, often for half the time.' },
  ],
  edges: [
    { from: 'w-suspended', to: 'w-started', label: 'a query' },
    { from: 'w-started', to: 'w-idle', label: 'work done' },
  ],
})
