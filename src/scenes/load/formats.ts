import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { rowsOf } from '../recorded'
import { loadTree } from './tree'
import session from '../../../spine/load/02-formats/session.txt?raw'
import sql from '../../../spine/load/02-formats/project/setup/file_formats.sql?raw'

// §5.2 — File formats: four named contracts; a staged file read through one before any load
// (recorded on Snowflake).
const peek = rowsOf(session, 'ORDER_ID', 4, 0, 3)

export const loadFormats: SceneModel = ideFrame2({
  model: 'A file format: how to read one sender’s files',
  tree: loadTree('queries/peek.sql', 'setup/file_formats.sql', ['setup/file_formats.sql', 'queries/peek.sql']),
  editor: { file: 'setup/file_formats.sql', code: sql },
  session,
  keep: ['$ bash load/as-loader.sh -f setup/file_formats.sql', '$ bash load/as-loader.sh -f queries/peek.sql', ['| ORDER_ID', '| 16522']],
  side: [
    {
      type: 'group', id: 'contract', badge: 1, title: 'A format is a contract', sub: 'between a sender and the warehouse', tone: 'infra', children: [
        { type: 'table', id: 'formats', columns: ['format', 'reads', 'from'], rows: [
          { cells: ['FF_CSV', 'CSV, UTF-8', 'the shop'], tone: 'source' },
          { cells: ['FF_CSV_LATIN1', 'CSV, Latin-1', 'returns'], tone: 'consume' },
          { cells: ['FF_JSON', 'a JSON a line', 'the tracker'], tone: 'ingest' },
          { cells: ['FF_PARQUET', 'typed columns', 'payments'], tone: 'store' },
        ] },
      ],
    },
    {
      type: 'group', id: 'peek', badge: 2, title: 'Read before loading', sub: 'Black Friday’s first orders, straight from the stage', tone: 'neutral', children: [
        { type: 'item', id: 'p-file', icon: 'file', title: 'orders-2026-11-27.csv', sub: 'still a file on @LANDING' },
        { type: 'table', id: 'rows', columns: ['order_id', 'order_ts', 'status', 'total'], rows: peek },
      ],
    },
  ],
  edges: [{ from: 'p-file', to: 'rows', label: 'FF_CSV' }],
})
