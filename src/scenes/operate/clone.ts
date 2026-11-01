import type { SceneModel } from '@graphlearning/graphl-flow'
import { keepLines, terminal } from '../ide'
import { cell } from '../recorded'
import session from '../../../spine/operate/03-clone/session.txt?raw'

// §12.3 — ◆ Zero-copy clone (recorded on Snowflake): ANALYTICS_DEV cloned from ANALYTICS. The rows
// and the storage are the run's; storage figures are computed in the background, so the reading
// after the update has not caught up (said in the frame, not hidden).
const rows = (db: number) => cell(session, 'ORDER_LINES', db)
const bytes = (db: number, after = 0) => cell(session, 'ACTIVE_BYTES', db, after)
const shell = terminal(session)

const db = (id: string, title: string, sub: string, n: number, tone: 'store' | 'serve') => ({
  type: 'group' as const, id, title, sub, icon: 'database', tone, children: [
    { type: 'table' as const, id: `${id}-t`, title: 'MARTS.FCT_ORDER_LINES', columns: ['rows', 'bytes of its own'], rows: [[rows(n), bytes(n)]] },
  ],
})

export const operateClone: SceneModel = {
  title: 'A zero-copy clone: the whole warehouse, copied in one statement',
  sub: 'Two databases, one set of micro-partitions, until one of them changes',
  dir: 'row',
  nodes: [
    {
      type: 'group', id: 'pic', bare: true, children: [
        {
          type: 'group', id: 'dbs', bare: true, dir: 'row', children: [
            db('prod', 'ANALYTICS', 'production: dbt builds it every night', 0, 'store'),
            db('dev', 'ANALYTICS_DEV', 'CREATE DATABASE … CLONE ANALYTICS', 1, 'serve'),
          ],
        },
        { type: 'item', id: 'parts', icon: 'layers', title: 'One set of micro-partitions', sub: 'stored once; both databases point at them' },
        { type: 'note', id: 'change', tone: 'consume', text: `A change in the copy writes new partitions for the copy alone. The update to order 18000 did; the storage reading after it still says ${bytes(1, 1)} bytes, because those figures are computed in the background.` },
        { type: 'note', id: 'use', tone: 'neutral', text: 'What it is for: a full-size place to try a change (a developer’s database, a pull request’s), made in seconds, paid for only as it diverges.' },
      ],
    },
    {
      type: 'group', id: 'proof', title: 'The run', icon: 'terminal', tone: 'neutral', children: [
        { type: 'code', id: 'out', terminal: true, filename: 'terminal — shopwave-dw', code: shell,
          show: keepLines(shell, ['CREATE OR REPLACE DATABASE ANALYTICS_DEV CLONE', 'successfully created', ['| DB', '| ANALYTICS_DEV | 35043'], ['| DB', '| ANALYTICS_DEV | 0'], ['UPDATE ANALYTICS_DEV', '| 1 '], ['| DB', '| ANALYTICS_DEV | 1 ']]) },
      ],
    },
  ],
  edges: [
    { from: 'prod', to: 'parts' },
    { from: 'dev', to: 'parts' },
  ],
}
