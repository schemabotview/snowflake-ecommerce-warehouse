import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { rowsOf } from '../recorded'
import { loadTree } from './tree'
import session from '../../../spine/load/05-validate/session.txt?raw'
import sql from '../../../spine/load/05-validate/project/queries/validate_returns.sql?raw'

// §5.5 — VALIDATION_MODE and ON_ERROR: the returns files checked, nothing loaded (recorded on
// Snowflake). The generator plants Latin-1 text and 3 malformed rows a month.
// The run's messages are cut at 52 characters by the query; the pane has room for 40.
const errors = rowsOf(session, 'ERROR', 2, 0, 3).map(([e, n]) => [e.length > 40 ? `${e.slice(0, 39)}…` : e, n])

export const loadValidate: SceneModel = ideFrame2({
  model: 'Validate first: find the bad rows, load nothing',
  tree: loadTree('queries/validate_returns.sql', 'queries/validate_returns.sql', ['load/returns_table.sql', 'queries/validate_returns.sql']),
  editor: { file: 'queries/validate_returns.sql', code: sql },
  session,
  keep: ['$ bash load/as-loader.sh -f load/returns_table.sql', '$ bash load/as-loader.sh -f queries/validate_returns.sql', ['| ERROR', '| matching enclosing']],
  side: [
    {
      type: 'group', id: 'split', badge: 1, title: 'Two kinds of bad row', sub: 'the returns files, read as plain UTF-8', tone: 'consume', children: [
        { type: 'item', id: 'v-files', icon: 'file', title: '12 monthly files', sub: 'from the returns warehouse' },
        {
          type: 'group', id: 'kinds', bare: true, dir: 'row', children: [
            { type: 'item', id: 'v-enc', icon: 'zap', title: 'Unreadable text', sub: 'every row with an accent', stack: true },
            { type: 'item', id: 'v-bad', icon: 'filter', title: 'Malformed rows', sub: 'a field missing, a bad date', stack: true },
          ],
        },
      ],
    },
    { type: 'table', title: 'What validation found (from the run)', id: 'errs', columns: ['error', 'rows'], rows: errors },
    {
      type: 'group', id: 'choices', badge: 2, title: 'ON_ERROR: what a load does at a bad row', tone: 'infra', children: [
        { type: 'table', id: 'onerr', columns: ['ON_ERROR', 'the file'], rows: [
          ['ABORT_STATEMENT', 'nothing loads (the default)'], ['SKIP_FILE', 'that whole file is skipped'],
          { cells: ['CONTINUE', 'good rows load, bad rows are counted'], tone: 'serve' },
        ] },
      ],
    },
  ],
  edges: [
    { from: 'v-files', to: 'v-enc' },
    { from: 'v-files', to: 'v-bad' },
    { from: 'v-bad', to: 'errs' },
  ],
})
