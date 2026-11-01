import type { SceneModel } from '@graphlearning/graphl-flow'
import { BUILT, SIDE_H, mapFrame } from '../map'
import { cell } from '../recorded'
import products from '../../../spine/start/03-first-table/session.txt?raw'
import budget from '../../../spine/start/05-budget/session.txt?raw'

// §3.7 — The project map: what exists after Course 3, lit; the rest still to come. Concept: nothing
// is run here; the inventory's numbers are read from this course's recorded steps (3.3, 3.5).
const loaded = cell(products, 'rows_loaded')
const used = cell(budget, 'used_credits')

export const startProjectMap: SceneModel = mapFrame({
  built: BUILT.start,
  side: [
    {
      type: 'group', id: 'left', bare: true, h: SIDE_H, spread: true, children: [
        {
          type: 'group', id: 'made', badge: 1, title: 'What Course 3 made, in order', tone: 'ingest', dir: 'row', children: [
            { type: 'item', id: 'x-shop', icon: 'postgresql', title: 'Shop database', sub: 'four tables, 2026', stack: true },
            { type: 'item', id: 'x-raw', icon: 'database', title: 'RAW and ANALYTICS', sub: 'five schemas', stack: true },
            { type: 'item', id: 'x-products', icon: 'table', title: 'PRODUCTS', sub: 'the first table', stack: true },
            { type: 'item', id: 'x-wh', icon: 'cpu', title: 'WH_LOAD', sub: 'XS, sleeps after 60 s', stack: true },
            { type: 'item', id: 'x-rm', icon: 'gauge', title: 'RM_MONTHLY', sub: '50 credits, then stop', stack: true },
          ],
        },
        {
          type: 'group', id: 'gaps', badge: 2, title: 'What it cannot do yet', tone: 'consume', dir: 'row', children: [
            { type: 'item', id: 'g-roles', icon: 'users', title: 'Everyone is the administrator', sub: 'Course 4: a role for each team' },
            { type: 'item', id: 'g-load', icon: 'package', title: 'One table, loaded by hand', sub: 'Course 5: every source, the same way' },
          ],
        },
      ],
    },
    {
      type: 'group', id: 'inventory', badge: 3, title: 'The account now', sub: 'read from this course’s recorded steps', icon: 'snowflakedb', tone: 'neutral', children: [
        { type: 'table', id: 'objects', columns: ['object', 'name', 'state'], rows: [
          ['database', 'RAW', 'schema SHOPWAVE'],
          ['table', 'RAW.SHOPWAVE.PRODUCTS', `${loaded} rows loaded`],
          ['database', 'ANALYTICS', 'STAGING, MARTS, BI: empty'],
          ['warehouse', 'WH_LOAD', 'XS, AUTO_SUSPEND 60'],
          ['monitor', 'RM_MONTHLY', `50 credits, ${used} used`],
        ] },
      ],
    },
  ],
  edges: [
    { from: 'x-shop', to: 'x-raw' },
    { from: 'x-raw', to: 'x-products' },
  ],
})
