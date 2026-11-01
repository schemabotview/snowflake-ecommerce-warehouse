import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { cell } from '../recorded'
import { loadTree } from './tree'
import session from '../../../spine/load/09-snowpipe/session.txt?raw'
import sql from '../../../spine/load/09-snowpipe/project/load/pipe.sql?raw'

// §5.9 — Snowpipe: payments loaded by a pipe, triggered by REFRESH on the internal stage (recorded on
// Snowflake). Auto-ingest from cloud events is doc-cited, not run: it needs an external stage
// (docs.snowflake.com/en/user-guide/data-load-snowpipe-auto).
const state = cell(session, 'PIPE'), payments = cell(session, 'PAYMENTS')

export const loadSnowpipe: SceneModel = ideFrame({
  tree: loadTree('queries/pipe_status.sql', 'load/pipe.sql', ['load/pipe.sql', 'queries/pipe_status.sql']),
  editor: { file: 'load/pipe.sql', code: sql },
  session,
  keep: ['$ bash load/as-loader.sh -f load/pipe.sql', '| 365', '$ sleep 120', '$ bash load/as-loader.sh -f queries/pipe_status.sql', ['| PIPE', '| RUNNING']],
  side: [
    {
      type: 'group', id: 'flow', badge: 1, title: 'A file, a pipe, a table', sub: 'Snowflake’s own compute: no warehouse', tone: 'ingest', children: [
        { type: 'item', id: 'p-file', icon: 'file', title: 'payments-<day>.parquet', sub: 'lands on @LANDING' },
        { type: 'item', id: 'p-pipe', icon: 'stream', title: 'PIPE_PAYMENTS', sub: 'a COPY, run for each new file' },
        { type: 'item', id: 'p-table', icon: 'table', title: 'RAW.SHOPWAVE.PAYMENTS', sub: `${payments} rows; pipe ${state}` },
      ],
    },
    {
      type: 'group', id: 'trigger', badge: 2, title: 'What tells the pipe', tone: 'neutral', children: [
        { type: 'table', id: 'triggers', columns: ['stage', 'trigger', 'here'], rows: [
          { cells: ['internal', 'ALTER PIPE … REFRESH', 'run'], tone: 'serve' },
          ['internal', 'the Snowpipe REST API', 'doc-cited'],
          ['external (S3)', 'cloud event: auto-ingest', 'doc-cited'],
        ] },
      ],
    },
    {
      type: 'group', id: 'cost', badge: 3, title: 'Who pays for the compute', tone: 'infra', children: [
        { type: 'table', id: 'compute', columns: ['', 'runs on', 'billed'], rows: [
          ['COPY INTO', 'WH_LOAD', 'per second, ≥ 60 s'],
          { cells: ['a pipe', 'serverless compute', 'per file loaded'], tone: 'serve' },
        ] },
        { type: 'item', id: 'why', icon: 'timer', title: 'A file every day', sub: 'no warehouse waits awake for it' },
      ],
    },
  ],
  edges: [
    { from: 'p-file', to: 'p-pipe', label: 'notified' },
    { from: 'p-pipe', to: 'p-table' },
  ],
})
