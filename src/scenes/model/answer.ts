import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { isRecorded, rowsOf } from '../recorded'
import { star } from '../star'
import { modelTree } from './tree'
import session from '../../../spine/model/09-answer/session.txt?raw'
import course1 from '../../../spine/intro/01-questions/session.txt?raw'
import sql from '../../../spine/model/09-answer/project/queries/revenue_by_month.sql?raw'

// §6.9 — The first answer: Course 1's question asked of the star (recorded on Snowflake), set beside
// what the shop database answered in 1.1 (run locally). Both are read; nothing is typed.
const s = star({ stage: 'roles', dims: ['date', 'customer', 'product'], lit: ['order_date_key', 'product_key', 'order_status', 'amount_eur'] })
const months = rowsOf(session, 'MONTH', 7, 0, 12)
const nov1 = course1.split('\n').find((l) => l.startsWith(' 2026-11'))!.split('|').map((c) => c.trim())
const nov6 = isRecorded(session) ? months.find(([m]) => m === '2026-11')! : months[0]
const round = (v: string) => (v === '…' ? v : String(Math.round(Number(v))))

export const modelAnswer: SceneModel = ideFrame({
  tree: modelTree('queries/revenue_by_month.sql', 'queries/revenue_by_month.sql'),
  editor: { file: 'queries/revenue_by_month.sql', code: sql },
  session,
  side: [
    s.node,
    {
      type: 'group', id: 'compare', badge: 1, title: 'November, two ways', sub: 'Course 1’s shop database and the star', tone: 'serve', children: [
        { type: 'table', id: 'nov', columns: ['asked of', 'electronics', 'home', 'beauty'], rows: [
          ['shop database (1.1)', nov1[1], nov1[2], nov1[4]],
          { cells: ['the star (6.9)', round(nov6[1]), round(nov6[2]), round(nov6[4])], tone: 'serve' },
        ] },
      ],
    },
    { type: 'note', id: 'why', tone: 'neutral', text: 'The same numbers, from a model built for the question: three short joins on keys, in a column store, on a warehouse of its own.' },
    { type: 'note', id: 'pivot', tone: 'neutral', text: 'PIVOT turns the six categories into six columns: the ones Course 1 wrote by hand.' },
  ],
  edges: s.edges,
})
