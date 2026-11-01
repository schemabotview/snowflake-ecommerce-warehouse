import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { rowsOf } from '../recorded'
import { loadTree } from './tree'
import session from '../../../spine/load/02-formats/session.txt?raw'
import sql from '../../../spine/load/02-formats/project/setup/file_formats.sql?raw'

// §5.2 — File formats: four named contracts; a staged file read through one before any load
// (recorded on Snowflake).
const peek = rowsOf(session, 'ORDER_ID', 4, 0, 3)

export const loadFormats: SceneModel = ideFrame({
  tree: loadTree('queries/peek.sql', 'setup/file_formats.sql', ['setup/file_formats.sql', 'queries/peek.sql']),
  editor: { file: 'setup/file_formats.sql', code: sql },
  session,
  side: [
    {
      type: 'group', id: 'contract', badge: 1, title: 'A format is a contract', sub: 'between a sender and the warehouse', tone: 'infra', children: [
        { type: 'table', id: 'formats', columns: ['format', 'reads', 'from'], rows: [
          { cells: ['FF_CSV', 'CSV, UTF-8, a header', 'the shop database'], tone: 'source' },
          { cells: ['FF_CSV_LATIN1', 'CSV, ISO-8859-1', 'the returns warehouse'], tone: 'consume' },
          { cells: ['FF_JSON', 'one JSON object a line', 'the site tracker'], tone: 'ingest' },
          { cells: ['FF_PARQUET', 'typed, columnar', 'the payment provider'], tone: 'store' },
        ] },
      ],
    },
    {
      type: 'group', id: 'peek', badge: 2, title: 'Read before loading', sub: 'Black Friday’s first orders, straight from the stage', tone: 'neutral', children: [
        { type: 'item', id: 'p-file', icon: 'file', title: 'orders-2026-11-27.csv', sub: 'still a file on @LANDING' },
        { type: 'table', id: 'rows', columns: ['order_id', 'order_ts', 'status', 'total'], rows: peek },
      ],
    },
    {
      type: 'group', id: 'options', badge: 3, title: 'What each option settles', tone: 'neutral', children: [
        { type: 'table', id: 'opts', columns: ['option', 'settles'], rows: [
          ['SKIP_HEADER = 1', 'the first line is names, not data'],
          ['FIELD_OPTIONALLY_ENCLOSED_BY', 'a comma inside quotes is text'],
          ['NULL_IF, EMPTY_FIELD_AS_NULL', 'an empty field is NULL'],
          { cells: ['ENCODING', 'which bytes are which letters'], tone: 'consume' },
        ] },
      ],
    },
  ],
  edges: [{ from: 'p-file', to: 'rows', label: 'FF_CSV' }],
})
