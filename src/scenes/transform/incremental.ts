import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { view } from '../fold'
import { fromRun, isRecorded } from '../recorded'
import { transformTree } from './tree'
import session from '../../../spine/transform/06-incremental/session.txt?raw'
import sql from '../../../spine/transform/06-incremental/project/dbt/models/marts/core/fct_order_lines.sql?raw'

// §7.6 — An incremental fact: a full refresh, then a run with nothing new to merge (recorded on Snowflake).
// dbt's status lines are longer than the terminal: read them with the 80-column wrap undone.
const flat = session.replace(/^(.{80})\n/gm, '$1')
const runs = isRecorded(session) ? [...flat.matchAll(/incremental model \S+\s+\[SUCCESS (\d+) in/g)].map((m) => `${m[1]} rows merged`) : ['…', '…']
const done = fromRun(session, /(Done\..*)$/m)

export const transformIncremental: SceneModel = ideFrame({
  tree: transformTree('dbt/models/marts/core/fct_order_lines.sql', 'dbt/models/marts/core/fct_order_lines.sql'),
  editor: { file: 'dbt/models/marts/core/fct_order_lines.sql', code: sql, ...view(sql, '{{ config', '{% endif %}', 0) },
  session,
  keep: ['$ dbt run --select fct_order_lines --full-refresh', ['OK created sql incremental', 'S 35043'], 'Done. PASS=1', '$ dbt run --select fct_order_lines', ['OK created sql incremental', 'S 0 in'], 'Done. PASS=1'],
  side: [
    {
      type: 'group', id: 'two', badge: 1, title: 'Two runs of one model', tone: 'infra', children: [
        {
          type: 'group', id: 'first', title: '--full-refresh', tone: 'store', dir: 'row', children: [
            { type: 'item', id: 'f-all', icon: 'table', title: 'Every order line', sub: 'CREATE TABLE … AS SELECT' },
            { type: 'item', id: 'f-res', icon: 'check', title: runs[0] ?? '…', sub: 'from the run' },
          ],
        },
        {
          type: 'group', id: 'next', title: 'the next run', tone: 'serve', dir: 'row', children: [
            { type: 'item', id: 'n-new', icon: 'filter', title: 'Newer than max(order_ts)', sub: 'is_incremental(): only new orders' },
            { type: 'item', id: 'n-res', icon: 'check', title: runs[1] ?? '…', sub: 'MERGE on order_line_key' },
          ],
        },
      ],
    },
    {
      type: 'group', id: 'config', badge: 2, title: 'The model’s first lines, read', tone: 'neutral', children: [
        { type: 'table', id: 'cfg', columns: ['setting', 'means'], rows: [
          ['incremental', 'built once, then added to'],
          ['unique_key', 'a changed line updates'],
          ['merge', 'one MERGE per run'],
          { cells: ['is_incremental()', 'true after the first run'], tone: 'serve' },
        ] },
      ],
    },
    { type: 'note', id: 'done', tone: 'neutral', text: `dbt’s summary: ${done}` },
    { type: 'note', id: 'why', tone: 'serve', text: 'A year of order lines is small; ten years are not. Incremental rebuilds only what changed, every night, and the cost of a night stays flat as history grows.' },
    { type: 'note', id: 'late', tone: 'consume', text: 'The filter sees only NEW orders. An order whose status changes after it was loaded is missed: Course 8 handles change.' },
  ],
  edges: [
    { from: 'f-all', to: 'f-res' },
    { from: 'n-new', to: 'n-res' },
  ],
})
