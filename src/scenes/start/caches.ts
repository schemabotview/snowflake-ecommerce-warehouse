import type { SceneModel } from '@graphlearning/graphl-flow'
import { terminal } from '../ide'
import { rowsOf } from '../recorded'
import session from '../../../spine/start/06-caches/session.txt?raw'

// §3.6 — ◆ three caches. One query run cold, warm, and twice with the result cache on; QUERY_HISTORY
// says what each cost (recorded on Snowflake; times volatile). How each cache works is doc-cited:
// docs.snowflake.com/en/user-guide/querying-persisted-results, …/performance-query-warehouse-cache.
const runs = rowsOf(session, 'RUN', 4)

export const startCaches: SceneModel = {
  title: 'Three caches: why the same query costs less the second time',
  sub: 'One query on TPC-H LINEITEM: cold, warm, and twice from the result cache',
  dir: 'row',
  nodes: [
    {
      type: 'group', id: 'left', bare: true, children: [
        {
          type: 'group', id: 'kinds', bare: true, dir: 'row', children: [
            {
              type: 'group', id: 'c-result', badge: 1, title: 'Result cache', sub: 'in cloud services', icon: 'cloud', tone: 'serve', children: [
                { type: 'item', id: 'r-what', icon: 'check', title: 'The same query, unchanged data', sub: 'answered with no warehouse at all' },
                { type: 'item', id: 'r-life', icon: 'clock', title: 'Kept 24 hours', sub: 'each reuse extends it, up to 31 days' },
              ],
            },
            {
              type: 'group', id: 'c-local', badge: 2, title: 'Warehouse cache', sub: 'the warehouse’s local disks', icon: 'cpu', tone: 'infra', children: [
                { type: 'item', id: 'l-what', icon: 'disk', title: 'Micro-partitions already read', sub: 'reused by any query on this warehouse' },
                { type: 'item', id: 'l-life', icon: 'power', title: 'Lost on suspend', sub: 'the price of auto-suspend' },
              ],
            },
            {
              type: 'group', id: 'c-meta', badge: 3, title: 'Metadata', sub: 'in cloud services', icon: 'search', tone: 'store', children: [
                { type: 'item', id: 'm-what', icon: 'table', title: 'Counts, min and max', sub: 'COUNT(*) with no warehouse (2.1)' },
                { type: 'item', id: 'm-life', icon: 'lock', title: 'Always current', sub: 'kept with every partition' },
              ],
            },
          ],
        },
        {
          type: 'group', id: 'history', badge: 4, title: 'What each run cost', sub: 'QUERY_HISTORY_BY_SESSION, from the run', icon: 'chart', tone: 'neutral', children: [
            { type: 'table', id: 'runs', columns: ['run', 'elapsed ms', 'bytes scanned', 'from cache'], rows: runs },
          ],
        },
      ],
    },
    {
      type: 'group', id: 'proof', title: 'The runs', icon: 'terminal', tone: 'neutral', children: [
        { type: 'code', id: 'out', terminal: true, filename: 'terminal — shopwave-dw', code: terminal(session) },
      ],
    },
  ],
}
