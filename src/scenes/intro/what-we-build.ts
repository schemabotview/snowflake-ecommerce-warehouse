import type { SceneModel } from '@graphlearning/graphl-flow'
import { EVERYTHING, MAP_EDGES, warehouseMap } from '../map'

// §1.3 — What we'll build: the map, every part lit — the finished warehouse — and under it what each
// course adds (COURSE-PLAN.md, "After course … the warehouse can…"). Concept: nothing is run here.
const COURSES: [number, string, string, string][] = [
  [2, 'how-snowflake-runs', 'How Snowflake is built', 'layers, credits, editions'],
  [3, 'start', 'A first warehouse', 'one table, a budget'],
  [4, 'secure', 'Roles before data', 'three teams, least privilege'],
  [5, 'load', 'Getting data in', 'every source, raw, JSON too'],
  [6, 'model', 'Dimensional modelling', 'the star, by hand'],
  [7, 'transform', 'dbt on Snowflake', 'the star, built and tested'],
  [8, 'history', 'Time in the warehouse', 'SCD2, prices, currency'],
  [9, 'facts', 'Every kind of fact', 'lifecycle, sessions, funnel'],
  [10, 'perform', 'Fast and cheap', 'pruning, clustering, scaling'],
  [11, 'serve', 'Serving BI and a partner', 'one revenue, masking, a share'],
  [12, 'operate', 'Every night, safely', 'tasks, clones, CI'],
]

export const introWhatWeBuild: SceneModel = {
  title: 'What we will build: shopwave-dw, Shopwave’s warehouse on Snowflake',
  sub: 'Sources in; loaded raw, modelled into a star, tested with dbt; served to BI and to a partner',
  nodes: [
    warehouseMap(EVERYTHING),
    {
      type: 'group', id: 'courses', title: 'Built course by course', icon: 'workflow', tone: 'neutral', dir: 'grid', cols: 6,
      children: [
        { type: 'item', id: 'c-1', title: '1 · Why a warehouse', sub: 'OLTP vs OLAP' },
        ...COURSES.map(([n, id, title, sub]) => ({ type: 'item' as const, id: `c-${id}`, title: `${n} · ${title}`, sub })),
      ],
    },
  ],
  edges: MAP_EDGES,
}
