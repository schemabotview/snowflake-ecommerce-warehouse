import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { view } from '../fold'
import { rowsOf } from '../recorded'
import { loadTree } from './tree'
import session from '../../../spine/load/03-copy/session.txt?raw'
import sql from '../../../spine/load/03-copy/project/load/copy.sql?raw'

// §5.3 — COPY INTO: four tables loaded file by file, each row stamped with its file (recorded on Snowflake).
const loaded = [0, 1, 2, 3].map((n) => rowsOf(session, 'TBL', 3, n)[0])

export const loadCopy: SceneModel = ideFrame({
  tree: loadTree('load/copy.sql', 'load/copy.sql', ['load/tables.sql', 'load/copy.sql']),
  editor: { file: 'load/copy.sql', code: sql, ...view(sql, 'COPY INTO ORDERS', 'COPY INTO CUSTOMERS', 1) },
  session,
  side: [
    {
      type: 'group', id: 'how', badge: 1, title: 'Stage to table, file by file', tone: 'ingest', children: [
        { type: 'item', id: 'c-files', icon: 'folder', title: '@LANDING/orders/', sub: '365 daily files' },
        { type: 'item', id: 'c-copy', icon: 'cpu', title: 'COPY INTO, on WH_LOAD', sub: 'files read in parallel, by the warehouse' },
        { type: 'item', id: 'c-table', icon: 'table', title: 'RAW.SHOPWAVE.ORDERS', sub: 'plus _FILE and _LOADED_AT on every row' },
      ],
    },
    {
      type: 'group', id: 'result', badge: 2, title: 'What was loaded', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'loaded', columns: ['table', 'files', 'rows'], rows: loaded },
      ],
    },
    {
      type: 'group', id: 'extra', badge: 3, title: 'Two columns on every row', tone: 'infra', children: [
        { type: 'table', id: 'cols', columns: ['column', 'holds'], rows: [
          ['_FILE', 'orders/orders-2026-01-01.csv: its source file'],
          ['_LOADED_AT', 'when the COPY ran'],
        ] },
      ],
    },
    { type: 'note', id: 'lineage', tone: 'neutral', text: 'METADATA$FILENAME keeps each row’s source file: a wrong number can always be traced to the file it came from.' },
  ],
  edges: [
    { from: 'c-files', to: 'c-copy' },
    { from: 'c-copy', to: 'c-table' },
  ],
})
