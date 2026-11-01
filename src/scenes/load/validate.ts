import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { rowsOf } from '../recorded'
import { loadTree } from './tree'
import session from '../../../spine/load/05-validate/session.txt?raw'
import sql from '../../../spine/load/05-validate/project/queries/validate_returns.sql?raw'

// §5.5 — VALIDATION_MODE and ON_ERROR: the returns files checked, nothing loaded (recorded on
// Snowflake). The generator plants Latin-1 text and 3 malformed rows a month.
const errors = rowsOf(session, 'ERROR', 2, 0, 3)

export const loadValidate: SceneModel = ideFrame({
  tree: loadTree('queries/validate_returns.sql', 'queries/validate_returns.sql', ['load/returns_table.sql', 'queries/validate_returns.sql']),
  editor: { file: 'queries/validate_returns.sql', code: sql },
  session,
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
    {
      type: 'group', id: 'found', badge: 2, title: 'What validation found', sub: 'from the run: nothing was loaded', tone: 'neutral', children: [
        { type: 'table', id: 'errs', columns: ['error', 'rows'], rows: errors },
      ],
    },
    {
      type: 'group', id: 'choices', badge: 3, title: 'ON_ERROR: what a load does at a bad row', tone: 'infra', children: [
        { type: 'table', id: 'onerr', columns: ['ON_ERROR', 'the file'], rows: [
          ['ABORT_STATEMENT', 'nothing loads (the default)'], ['SKIP_FILE', 'that whole file is skipped'],
          { cells: ['CONTINUE', 'good rows load, bad rows are counted'], tone: 'serve' },
        ] },
      ],
    },
    { type: 'note', id: 'free', tone: 'neutral', text: 'VALIDATION_MODE reads every file and writes nothing: a dry run that costs only the warehouse time.' },
  ],
  edges: [
    { from: 'v-files', to: 'v-enc' },
    { from: 'v-files', to: 'v-bad' },
  ],
})
