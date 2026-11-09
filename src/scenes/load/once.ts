import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { cell } from '../recorded'
import { loadTree } from './tree'
import session from '../../../spine/load/04-once/session.txt?raw'
import sql from '../../../spine/load/04-once/project/queries/copy_again.sql?raw'

// §5.4 — A file loads once: the same COPY again loads nothing (recorded on Snowflake). The 64 days are
// doc-cited: docs.snowflake.com/en/user-guide/data-load-considerations-load.
const orders = cell(session, 'ORDERS'), files = cell(session, 'FILES')

export const loadOnce: SceneModel = ideFrame2({
  model: 'Load metadata: each file loads once',
  tree: loadTree('queries/copy_again.sql', 'queries/copy_again.sql'),
  editor: { file: 'queries/copy_again.sql', code: sql },
  session,
  keep: ['$ bash', 'Copy executed with 0 files processed', ['| ORDERS', '| 20024']],
  side: [
    {
      type: 'group', id: 'memory', badge: 1, title: 'Load metadata', sub: 'kept with the table, for 64 days', tone: 'infra', dir: 'row', children: [
        { type: 'item', id: 'm-file', icon: 'file', title: 'A loaded file', sub: 'its name, size, checksum', stack: true },
        { type: 'item', id: 'm-check', icon: 'search', title: 'Loaded before?', sub: 'every file, every COPY', stack: true },
        { type: 'item', id: 'm-skip', icon: 'check', title: 'Skipped', sub: 'never duplicated', stack: true },
      ],
    },
    { type: 'table', title: 'ORDERS after the second COPY (from the run)', id: 'count', columns: ['orders', 'from files'], rows: [[orders, files]] },
    {
      type: 'group', id: 'exceptions', badge: 2, title: 'When a file does load again', tone: 'consume', children: [
        { type: 'table', id: 'cases', columns: ['', 'loads?'], rows: [
          ['the same file, again', 'no'], ['the same name, new contents', 'yes'],
          ['FORCE = TRUE', 'yes: duplicates'], ['older than 64 days', 'unknown: skipped by default'],
        ] },
      ],
    },
  ],
  edges: [
    { from: 'm-file', to: 'm-check' },
    { from: 'm-check', to: 'm-skip', label: 'yes' },
    { from: 'm-skip', to: 'count' },
  ],
})
