import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { rowsOf } from '../recorded'
import { historyTree } from './tree'
import session from '../../../spine/history/02-snapshots/session.txt?raw'
import code from '../../../spine/history/02-snapshots/project/load/month_ends.sh?raw'

// §8.2 — dbt snapshots: the shop's customers table replicated at each month end, snapshotted after
// each (recorded on Snowflake). Customer 81's versions are the snapshot's own rows.
const versions = rowsOf(session, 'CUSTOMER_ID', 5, 0, 4)

export const historySnapshots: SceneModel = ideFrame2({
  model: 'A snapshot: every version the source forgets',
  tree: historyTree('queries/customer_81.sql', 'load/month_ends.sh', ['load/customer_changes.sql', 'load/customers_as_of.sql', 'load/month_ends.sh', 'dbt/snapshots/snap_customers.yml', 'queries/customer_81.sql']),
  editor: { file: 'load/month_ends.sh', code, lang: 'shell' },
  session,
  keep: ['$ bash load/month_ends.sh', '2025-12-31: CUSTOMER_STATE', '2026-12-31: CUSTOMER_STATE', ['| CUSTOMER_ID', '| 81          | AT      | gold']],
  side: [
    {
      type: 'group', id: 'how', badge: 1, title: 'A snapshot, run every night', tone: 'infra', children: [
        { type: 'item', id: 's-state', icon: 'table', title: 'CUSTOMER_STATE', sub: 'the shop’s table: only the current row' },
        { type: 'item', id: 's-snap', icon: 'clock', title: 'dbt snapshot', sub: 'updated_at moved? close the old row, add a new one' },
        { type: 'item', id: 's-table', icon: 'layers', title: 'SNAP_CUSTOMERS', sub: 'every version, dbt_valid_from / dbt_valid_to' },
      ],
    },
    { type: 'table', title: 'Customer 81’s versions (from the run)', id: 'v', columns: ['id', 'country', 'tier', 'valid from', 'valid to'], rows: versions },
    { type: 'item', id: 'catch', icon: 'zap', tone: 'consume', title: 'Two changes between runs: one version', sub: 'a snapshot keeps only what it sees' },
  ],
  edges: [
    { from: 's-state', to: 's-snap' },
    { from: 's-snap', to: 's-table' },
    { from: 's-table', to: 'v' },
  ],
})
