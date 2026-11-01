import type { Edge, Item, SceneModel } from '@graphlearning/graphl-flow'
import { terminal } from '../ide'
import { DAG, SOURCES } from './dag'
import session from '../../../spine/transform/04-dag/session.txt?raw'

// §7.4 — ◆ ref() and the DAG, drawn from dbt's manifest (runs locally: `dbt parse` needs no
// connection). Every node and edge below is read from the run; layout by layer.
const chip = (id: string, title: string, sub?: string): Item => ({ type: 'item', id, title, sub, chip: true })
const stg = DAG.filter((n) => n.name.startsWith('stg_'))
const core = DAG.filter((n) => !n.name.startsWith('stg_') && n.name !== 'fct_order_lines')
const fct = DAG.find((n) => n.name === 'fct_order_lines')!
const edges: Edge[] = [
  ...stg.map((n) => ({ from: `src-${n.parents[0]}`, to: n.name })),
  ...core.flatMap((n) => n.parents.map((p) => ({ from: p, to: n.name }))),
  { from: 'core', to: fct.name, label: `${fct.parents.length} refs` },
]

export const transformDag: SceneModel = {
  title: 'ref() and the DAG: dbt works out the order',
  sub: `From dbt’s manifest: ${DAG.length} models, ${SOURCES.length} sources, every arrow a ref() or a source()`,
  dir: 'row',
  nodes: [
    {
      type: 'group', id: 'graph', bare: true, dir: 'row', children: [
        { type: 'group', id: 'sources', badge: 1, title: 'RAW', sub: 'source()', tone: 'ingest', children: stg.map((n) => chip(`src-${n.parents[0]}`, n.parents[0])) },
        { type: 'group', id: 'staging', badge: 2, title: 'STAGING', sub: 'views', tone: 'store', children: stg.map((n) => chip(n.name, n.name)) },
        { type: 'group', id: 'core', badge: 3, title: 'MARTS', sub: 'tables; one ephemeral', tone: 'serve', children: core.map((n) => chip(n.name, n.name, n.mat)) },
        { type: 'item', id: fct.name, icon: 'table', title: fct.name, sub: `${fct.mat}: the fact, last`, tone: 'serve' },
      ],
    },
    {
      type: 'group', id: 'proof', title: 'dbt parse, then the manifest read', icon: 'terminal', tone: 'neutral', children: [
        { type: 'code', id: 'out', terminal: true, filename: 'terminal — shopwave-dw/dbt', code: terminal(session) },
      ],
    },
  ],
  edges,
}
