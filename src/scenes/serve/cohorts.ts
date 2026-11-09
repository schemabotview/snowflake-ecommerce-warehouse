import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf } from '../ide'
import { ideFrame2 } from '../frame'
import { rowsOf } from '../recorded'
import { serveTree } from './tree'
import session from '../../../spine/serve/02-cohorts/session.txt?raw'
import sql from '../../../spine/serve/02-cohorts/project/dbt/models/marts/bi/mart_cohorts.sql?raw'

// §11.2 — Cohort retention (recorded on Snowflake): the triangle is the run's pivot of mart_cohorts.
const triangle = rowsOf(session, 'COHORT', 7, 0, 6).map((r) => r.map((c) => (c === 'None' ? '' : c)))

export const serveCohorts: SceneModel = ideFrame2({
  model: 'A cohort: customers who started together',
  tree: serveTree('queries/cohorts.sql', 'dbt/models/marts/bi/mart_cohorts.sql', ['dbt/models/marts/bi/mart_cohorts.sql', 'queries/cohorts.sql']),
  editor: { file: 'dbt/models/marts/bi/mart_cohorts.sql', code: sql, show: [[lineOf(sql, 'with orders'), lineOf(sql, 'select customer_id, min(month)') + 1], [lineOf(sql, '    f.cohort,') - 1, lineOf(sql, 'group by 1, 2, 4')]] },
  session,
  keep: ['1 of 1 OK created', ['| COHORT', '| 2026-06']],
  side: [
    {
      type: 'group', id: 'how', badge: 1, title: 'A cohort: customers who started together', tone: 'infra', children: [
        { type: 'item', id: 'c-first', icon: 'clock', title: 'Each customer’s first paid month', sub: 'their cohort' },
        { type: 'item', id: 'c-later', icon: 'users', title: 'Who ordered again, n months later', sub: 'counted per cohort' },
        { type: 'item', id: 'c-pct', icon: 'chart', title: '÷ the cohort’s size', sub: 'retention, in %' },
      ],
    },
    {
      type: 'group', id: 'tri', badge: 2, title: 'Ordered again, % of the cohort', sub: 'from the run: months 1 to 5', tone: 'neutral', children: [
        { type: 'table', id: 't', columns: ['cohort', 'size', '1', '2', '3', '4', '5'], rows: triangle },
      ],
    },
    { type: 'item', id: 'jan', icon: 'zap', tone: 'consume', title: 'January is not a true cohort', sub: 'the data starts on January 1: every customer’s “first” order lands in it' },
  ],
  edges: [
    { from: 'c-first', to: 'c-later' },
    { from: 'c-later', to: 'c-pct' },
  ],
})
