import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { cell, rowsOf } from '../recorded'
import { factsTree } from './tree'
import session from '../../../spine/facts/05-funnel/session.txt?raw'
import sql from '../../../spine/facts/05-funnel/project/queries/funnel.sql?raw'

// §9.5 — The funnel, from fct_funnel (recorded on Snowflake). It WIDENS at the last step: three
// visits bought with no checkout click — the run's own second result says which.
const n = (column: string) => cell(session, column)
const lone = rowsOf(session, 'STARTED_AT', 2, 0, 3)
const step = (id: string, title: string, column: string, sub?: string, tone?: 'consume') => ({ type: 'item' as const, id, icon: 'filter', title: `${title}: ${n(column)}`, sub, tone })

export const factsFunnel: SceneModel = ideFrame2({
  model: 'A funnel: sessions reaching each step',
  tree: factsTree('queries/funnel.sql', 'queries/funnel.sql', ['dbt/models/marts/fct_funnel.sql', 'queries/funnel.sql']),
  editor: { file: 'queries/funnel.sql', code: sql },
  session,
  keep: ['1 of 1 OK created', ['| SESSIONS', '| 79776'], ['| STARTED_AT', '+--------------------------------------------------------+']],
  side: [
    {
      type: 'group', id: 'f', badge: 1, title: 'The year’s funnel', sub: 'sessions reaching each step, from the run', tone: 'serve', children: [
        step('f-s', 'visits', 'SESSIONS'),
        step('f-v', 'viewed a product', 'VIEWED'),
        step('f-c', 'added to cart', 'CARTED'),
        step('f-o', 'checked out', 'CHECKED_OUT'),
        step('f-p', 'purchased', 'PURCHASED', `${n('CONVERSION_PCT')}% of visits: more than checked out`, 'consume'),
      ],
    },
    {
      type: 'group', id: 'odd', badge: 2, title: 'Bought, but never checked out', sub: 'from the run', tone: 'consume', children: [
        { type: 'table', id: 'l', columns: ['session started', 'clicks'], rows: lone },
      ],
    },
  ],
  edges: [
    { from: 'f-s', to: 'f-v' },
    { from: 'f-v', to: 'f-c' },
    { from: 'f-c', to: 'f-o' },
    { from: 'f-o', to: 'f-p' },
  ],
})
