import type { SceneModel } from '@graphlearning/graphl-flow'
import { BUILT, SIDE_H, mapFrame } from '../map'
import { cell, rowsOf } from '../recorded'
import session from '../../../spine/serve/08-dashboard/session.txt?raw'

// §11.8 — The dashboard (recorded on Snowflake): the map with everything Course 11 served lit, and
// the dashboard's first tile, as an analyst reads it from the mart. The dashboard tool itself is a
// concept: Snowsight is never screenshotted; the query behind the tile is the run.
const tile = rowsOf(session, 'CATEGORY', 4, 0, 6)
const total = cell(session, 'BLACK_FRIDAY_EUR')

export const serveDashboard: SceneModel = mapFrame({
  built: BUILT.serve,
  side: [
    {
      type: 'group', id: 'left', bare: true, h: SIDE_H, spread: true, children: [
        {
          type: 'group', id: 'path', badge: 1, title: 'What a dashboard tile reads', tone: 'serve', dir: 'row', children: [
            { type: 'item', id: 'd-mart', icon: 'pie', title: 'BI.MART_REVENUE', sub: 'one definition (11.3)', stack: true },
            { type: 'item', id: 'd-wh', icon: 'cpu', title: 'WH_BI', sub: '1 to 3 clusters (10.4)', stack: true },
            { type: 'item', id: 'd-role', icon: 'shield', title: 'ANALYST', sub: 'emails masked (11.4)', stack: true },
            { type: 'item', id: 'd-tile', icon: 'chart', title: 'The tile', sub: 'Black Friday by category', stack: true },
          ],
        },
        { type: 'note', id: 'total', tone: 'serve', text: `Black Friday, 2026-11-27: ${total} EUR from paid orders, the opening question of the course answered from the mart.` },
      ],
    },
    {
      type: 'group', id: 'tile', badge: 2, title: 'Black Friday revenue by category', sub: 'from the run, as ANALYST', icon: 'chart', tone: 'neutral', children: [
        { type: 'table', id: 't', columns: ['category', 'revenue €', 'orders', 'AOV €'], rows: tile },
      ],
    },
  ],
  edges: [
    { from: 'd-mart', to: 'd-wh' },
    { from: 'd-wh', to: 'd-role' },
    { from: 'd-role', to: 'd-tile' },
  ],
})
