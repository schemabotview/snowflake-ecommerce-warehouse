import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { rowsOf } from '../recorded'
import { transformTree } from './tree'
import session from '../../../spine/transform/05-materialisations/session.txt?raw'
import sql from '../../../spine/transform/05-materialisations/project/dbt/models/marts/core/int_first_payment.sql?raw'

// §7.5 — Materialisations: dbt run --select marts, then what Snowflake holds (recorded on Snowflake).
const built = rowsOf(session, 'TABLE_SCHEMA', 3, 0, 12)

export const transformMaterialisations: SceneModel = ideFrame({
  tree: transformTree('queries/materialised.sql', 'dbt/models/marts/core/int_first_payment.sql', ['dbt/models/marts/core/int_first_payment.sql', 'queries/materialised.sql']),
  editor: { file: 'dbt/models/marts/core/int_first_payment.sql', code: sql },
  session,
  keep: ['$ dbt run --select marts', 'Done. PASS=4', ['| TABLE_SCHEMA', '| MARTS        | FCT_ORDER_LINES'], '| STAGING      | STG_CLICKS'],
  side: [
    {
      type: 'group', id: 'kinds', badge: 1, title: 'What each materialisation builds', tone: 'infra', children: [
        { type: 'table', id: 'mats', columns: ['materialized', 'in Snowflake', 'computed'], rows: [
          ['view', 'a VIEW', 'every time it is read'],
          ['table', 'a TABLE', 'every dbt run'],
          { cells: ['ephemeral', 'nothing: a CTE', 'inside each model using it'], tone: 'serve' },
          ['incremental', 'a TABLE', 'only new rows (next)'],
        ] },
      ],
    },
    {
      type: 'group', id: 'held', badge: 2, title: 'What ANALYTICS holds now', sub: 'INFORMATION_SCHEMA.TABLES, from the run', tone: 'neutral', children: [
        { type: 'table', id: 'objects', columns: ['schema', 'name', 'type'], rows: built },
      ],
    },
    { type: 'note', id: 'check', tone: 'neutral', text: 'int_first_payment is in the project and nowhere in Snowflake: ephemeral, as configured.' },
  ],
  edges: [],
})
