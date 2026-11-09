import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { rowsOf } from '../recorded'
import { historyTree } from './tree'
import session from '../../../spine/history/08-dynamic-tables/session.txt?raw'
import sql from '../../../spine/history/08-dynamic-tables/project/queries/dynamic.sql?raw'

// §8.8 — Dynamic tables vs dbt incremental (recorded on Snowflake). Suspended at the end: a
// demonstration must not keep spending trial credits.
const shown = rowsOf(session, 'name', 4, 0, 1)

export const historyDynamic: SceneModel = ideFrame2({
  model: 'A dynamic table: Snowflake keeps it fresh',
  tree: historyTree('queries/dynamic.sql', 'queries/dynamic.sql', ['setup/dynamic_grants.sql', 'queries/dynamic.sql']),
  editor: { file: 'queries/dynamic.sql', code: sql },
  session,
  keep: ['$ snow sql -f setup/dynamic_grants.sql', '$ bash model/as-transformer.sh -f queries/dynamic.sql', 'DT_DAILY_REVENUE successfully created', ['| name', '| DT_DAILY_REVENUE'], 'ALTER DYNAMIC TABLE DT_DAILY_REVENUE SUSPEND'],
  side: [
    { type: 'table', title: 'Two ways to keep a table fresh', id: 'vs', columns: ['', 'dbt incremental', 'dynamic'], rows: [
          ['run by', 'a schedule', 'Snowflake'],
          ['fresh', 'per run', 'TARGET_LAG'],
          ['rebuilds', 'your filter', 'Snowflake decides'],
          ['tests, docs', 'yes', 'no'],
        ] },
    { type: 'table', title: 'DT_DAILY_REVENUE (from the run)', id: 'dt', columns: ['name', 'target lag', 'refresh', 'state'], rows: shown },
    {
      type: 'group', id: 'choose', badge: 1, title: 'Shopwave’s choice', tone: 'serve', children: [
        { type: 'item', id: 'c-dbt', icon: 'workflow', title: 'The star: dbt', sub: 'tested every night, documented' },
        { type: 'item', id: 'c-dt', icon: 'zap', title: 'Small, fresh summaries: either', sub: 'dbt can build one as materialized: dynamic_table' },
        { type: 'item', id: 'c-stream', icon: 'stream', title: 'Change feeds: a stream', sub: 'consumed by whatever runs next (8.7)' },
      ],
    },
  ],
  edges: [{ from: 'dt', to: 'choose' }],
})
