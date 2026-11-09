import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { cell } from '../recorded'
import { performTree } from './tree'
import before from '../../../spine/perform/02-pruning/session.txt?raw'
import session from '../../../spine/perform/03-clustering/session.txt?raw'
import sql from '../../../spine/perform/03-clustering/project/dbt/models/marts/core/fct_order_lines.sql?raw'

// §10.3 — Clustering keys: fct_order_lines rebuilt with cluster_by (recorded on Snowflake). Before
// is 10.2's run, after is this one's.
const row = (label: string, column: string) => [label, cell(before, column), cell(session, column)]

export const performClustering: SceneModel = ideFrame2({
  model: 'Clustering: store each stretch of dates together',
  tree: performTree('queries/clustering.sql', 'dbt/models/marts/core/fct_order_lines.sql', ['dbt/models/marts/core/fct_order_lines.sql', 'queries/clustering.sql']),
  editor: { file: 'dbt/models/marts/core/fct_order_lines.sql', code: sql, show: [[1, 22]] },
  session,
  keep: ['$ dbt run --select fct_order_lines --full-refresh', '1 of 1 OK created', ['| PARTITIONS', '| 8 '], ['| SCANNED', '+-----------------+']],
  side: [
    {
      type: 'group', id: 'how', badge: 1, title: 'What cluster_by does', tone: 'infra', children: [
        { type: 'item', id: 'c-key', icon: 'key', title: 'cluster_by: order_date_key', sub: 'one line in the model’s config' },
        { type: 'item', id: 'c-sort', icon: 'layers', title: 'dbt builds it ORDER BY that key', sub: 'and sets the table’s clustering key' },
        { type: 'item', id: 'c-part', icon: 'table', title: 'Each partition: one stretch of dates', sub: 'so its min and max are close together' },
      ],
    },
    {
      type: 'group', id: 'cmp', badge: 2, title: 'Before and after', sub: 'from the two runs', tone: 'neutral', children: [
        { type: 'table', id: 't', columns: ['', 'before', 'after'], rows: [
          row('partitions', 'PARTITIONS'), row('overlapping each', 'OVERLAPS'), row('depth', 'DEPTH'),
          { cells: row('November: read', 'SCANNED'), tone: 'serve' },
        ] },
      ],
    },
    { type: 'item', id: 'cost', icon: 'zap', tone: 'consume', title: 'Automatic Clustering re-sorts it', sub: 'in the background, billed separately' },
  ],
  edges: [
    { from: 'c-key', to: 'c-sort' },
    { from: 'c-sort', to: 'c-part' },
  ],
})
