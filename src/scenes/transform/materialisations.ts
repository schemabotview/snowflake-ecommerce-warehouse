import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { rowsOf } from '../recorded'
import { transformTree } from './tree'
import session from '../../../spine/transform/05-materialisations/session.txt?raw'
import sql from '../../../spine/transform/05-materialisations/project/dbt/models/marts/core/int_first_payment.sql?raw'

// §7.5 — Materialisations: dbt run --select marts, then what Snowflake holds (recorded on Snowflake).
const built = rowsOf(session, 'TABLE_SCHEMA', 3, 0, 12)

export const transformMaterialisations: SceneModel = ideFrame2({
  model: 'A materialisation: what a model becomes',
  tree: transformTree('queries/materialised.sql', 'dbt/models/marts/core/int_first_payment.sql', ['dbt/models/marts/core/int_first_payment.sql', 'queries/materialised.sql']),
  editor: { file: 'dbt/models/marts/core/int_first_payment.sql', code: sql },
  session,
  keep: ['$ dbt run --select marts', 'Done. PASS=4', ['| TABLE_SCHEMA', '| MARTS        | FCT_ORDER_LINES'], '| STAGING      | STG_CLICKS'],
  side: [
    { type: 'table', title: 'What each materialisation builds', id: 'mats', columns: ['materialized', 'in Snowflake', 'computed'], rows: [
          ['view', 'a VIEW', 'every time it is read'],
          ['table', 'a TABLE', 'every dbt run'],
          { cells: ['ephemeral', 'nothing: a CTE', 'inside each model using it'], tone: 'serve' },
          ['incremental', 'a TABLE', 'only new rows (next)'],
        ] },
    { type: 'table', title: 'What ANALYTICS holds now (from the run)', id: 'objects', columns: ['schema', 'name', 'type'], rows: built },
  ],
  edges: [{ from: 'mats', to: 'objects', label: 'dbt run' }],
})
