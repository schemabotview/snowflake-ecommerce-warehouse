import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { cell } from '../recorded'
import { operateTree } from './tree'
import session from '../../../spine/operate/04-undrop/session.txt?raw'
import sql from '../../../spine/operate/04-undrop/project/ops/undrop.sql?raw'

// §12.4 — Time travel and UNDROP (recorded on Snowflake): a mart dropped, found in the table history,
// restored; then read as it was five minutes earlier; the account's retention, 1 day.
const n = (column: string, row = 0, after = 0) => cell(session, column, row, after)

export const operateUndrop: SceneModel = ideFrame2({
  model: 'Time travel: a dropped table comes back',
  tree: operateTree('ops/undrop.sql', 'ops/undrop.sql'),
  editor: { file: 'ops/undrop.sql', code: sql },
  session,
  keep: ['MART_COHORTS successfully dropped', '| MART_COHORTS | 78', 'successfully restored', ['| ROWS_5_MINUTES_AGO', '| 78'], '| DATA_RETENTION'],
  side: [
    {
      type: 'group', id: 'life', badge: 1, title: 'A table’s life after DROP', tone: 'infra', dir: 'row', children: [
        { type: 'item', id: 'l-tt', icon: 'clock', title: 'Time travel: 1 day here', sub: 'AT a moment; UNDROP', stack: true },
        { type: 'item', id: 'l-fs', icon: 'lock', title: 'Fail-safe: 7 days more', sub: 'support only', stack: true },
        { type: 'item', id: 'l-gone', icon: 'package', title: 'Then gone', sub: 'no longer billed', stack: true },
      ],
    },
    { type: 'table', title: 'BI.MART_COHORTS, from the run', id: 'r', columns: ['moment', 'rows'], rows: [
          ['before the DROP', n('ROW_COUNT')],
          { cells: ['after UNDROP', n('ROW_COUNT', 0, 1)], tone: 'serve' },
          ['AT 5 minutes ago', n('ROWS_5_MINUTES_AGO')],
        ] },
    { type: 'item', id: 'plan', icon: 'clock', tone: 'consume', title: `Retention here: ${n('value')} day; Enterprise: up to 90`, sub: 'longer history costs more storage' },
  ],
  edges: [
    { from: 'l-tt', to: 'l-fs' },
    { from: 'l-fs', to: 'l-gone' },
    { from: 'l-tt', to: 'r' },
  ],
})
