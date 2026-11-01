import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { cell } from '../recorded'
import { operateTree } from './tree'
import session from '../../../spine/operate/04-undrop/session.txt?raw'
import sql from '../../../spine/operate/04-undrop/project/ops/undrop.sql?raw'

// §12.4 — Time travel and UNDROP (recorded on Snowflake): a mart dropped, found in the table history,
// restored; then read as it was five minutes earlier; the account's retention, 1 day.
const n = (column: string, row = 0, after = 0) => cell(session, column, row, after)

export const operateUndrop: SceneModel = ideFrame({
  tree: operateTree('ops/undrop.sql', 'ops/undrop.sql'),
  editor: { file: 'ops/undrop.sql', code: sql },
  session,
  keep: ['MART_COHORTS successfully dropped', '| MART_COHORTS | 78', 'successfully restored', ['| ROWS_5_MINUTES_AGO', '| 78'], '| DATA_RETENTION'],
  side: [
    {
      type: 'group', id: 'life', badge: 1, title: 'A table’s life after DROP', tone: 'infra', children: [
        { type: 'item', id: 'l-tt', icon: 'clock', title: 'Time travel: 1 day here', sub: 'query it AT a past moment; UNDROP it' },
        { type: 'item', id: 'l-fs', icon: 'lock', title: 'Fail-safe: 7 days more', sub: 'Snowflake support only, not you' },
        { type: 'item', id: 'l-gone', icon: 'package', title: 'Then gone', sub: 'and no longer billed as storage' },
      ],
    },
    {
      type: 'group', id: 'run', badge: 2, title: 'BI.MART_COHORTS, from the run', tone: 'neutral', children: [
        { type: 'table', id: 'r', columns: ['moment', 'rows'], rows: [
          ['before the DROP', n('ROW_COUNT')],
          { cells: ['after UNDROP', n('ROW_COUNT', 0, 1)], tone: 'serve' },
          ['AT 5 minutes ago', n('ROWS_5_MINUTES_AGO')],
        ] },
        { type: 'table', id: 'p', columns: ['retention', 'days'], rows: [[n('key'), n('value')]] },
      ],
    },
    { type: 'note', id: 'same', tone: 'serve', text: 'UNDROP returns the same table, with its rows, grants and policies. A rebuild would be a new table, without its history.' },
    { type: 'note', id: 'plan', tone: 'consume', text: 'Enterprise allows up to 90 days, set per table, schema or database: longer history costs more storage.' },
  ],
  edges: [
    { from: 'l-tt', to: 'l-fs' },
    { from: 'l-fs', to: 'l-gone' },
  ],
})
