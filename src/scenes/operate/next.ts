import type { SceneModel } from '@graphlearning/graphl-flow'
import { BUILT, SIDE_H, mapFrame } from '../map'

// §12.7 — Where next. Concept, doc-cited (Snowflake documentation: "Apache Iceberg tables",
// "Snowpark", "Snowflake Cortex"). Nothing is run. The map is the finished warehouse; each card names
// the part of it the feature would change. No part is added: the map's parts are fixed.
const card = (id: string, badge: number, title: string, where: string, what: string, why: string, icon: string, tone: 'ingest' | 'store' | 'serve') => ({
  type: 'group' as const, id, badge, title, sub: `on the map: ${where}`, icon, tone, children: [
    { type: 'item' as const, id: `${id}-what`, icon: 'layers', title: what, sub: 'what it is' },
    { type: 'item' as const, id: `${id}-why`, icon: 'zap', title: why, sub: 'when Shopwave would want it' },
  ],
})

export const operateNext: SceneModel = mapFrame({
  built: BUILT.operate,
  side: [
    {
      type: 'group', id: 'cards', bare: true, dir: 'row', h: SIDE_H, children: [
        card('iceberg', 1, 'Iceberg tables', 'RAW', 'Tables in an open format, in your own cloud storage', 'other engines (Spark) read the same files', 'disk', 'ingest'),
        card('snowpark', 2, 'Snowpark', 'Operations', 'Python and Java running inside the warehouse', 'logic SQL says badly: a forecast, a model', 'python', 'store'),
        card('cortex', 3, 'Cortex', 'BI', 'Language models called as SQL functions', 'the returns’ reasons, in four languages, sorted', 'chart', 'serve'),
        { type: 'note', id: 'doc', tone: 'neutral', text: 'Doc-cited: Snowflake documentation for each. Nothing here is run.' },
      ],
    },
  ],
  edges: [],
})
