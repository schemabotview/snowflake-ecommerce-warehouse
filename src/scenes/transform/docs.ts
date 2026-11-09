import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { transformTree } from './tree'
import { node } from './dag'
import session from '../../../spine/transform/09-docs/session.txt?raw'
import code from '../../../spine/transform/09-docs/project/dbt/lineage.py?raw'

// §7.9 — Docs and lineage: dbt docs generate (recorded on Snowflake: it reads the catalog), then one
// model's lineage from the manifest. The side pane's chain is read from 7.4's parsed DAG (runs locally).
// fct_order_lines and everything upstream of it (dbt's +fct_order_lines), by layer.
const up = new Set<string>()
const walk = (name: string) => { for (const p of node(name)?.parents ?? []) if (!up.has(p)) { up.add(p); walk(p) } }
walk('fct_order_lines')
const isModel = (n: string) => !!node(n)
const stg = [...up].filter((n) => n.startsWith('stg_')).sort()
const core = [...up].filter((n) => isModel(n) && !n.startsWith('stg_')).sort()
const raw = [...up].filter((n) => !isModel(n)).sort()
const chip = (prefix: string) => (n: string) => ({ type: 'item' as const, id: `${prefix}-${n}`, title: n, chip: true })

export const transformDocs: SceneModel = ideFrame2({
  model: 'TODO',
  tree: transformTree('dbt/lineage.py', 'dbt/lineage.py', ['dbt/lineage.py'], { 'dbt/target/': 'manifest, catalog' }),
  editor: { file: 'dbt/lineage.py', code },
  session,
  keep: ['$ dbt docs generate', 'Catalog written', '$ python lineage.py fct_order_lines', ['fct_order_lines (incremental)', '      customers (source)'], ['  stg_orders', '    orders (source)']],
  side: [
    {
      type: 'group', id: 'lineage', badge: 1, title: 'Everything fct_order_lines is built from', sub: 'from the manifest: +fct_order_lines', tone: 'store', children: [
        { type: 'group', id: 'ln-raw', title: `RAW: ${raw.length} sources`, tone: 'ingest', dir: 'grid', cols: 3, children: raw.map(chip('r')) },
        { type: 'group', id: 'ln-stg', title: `STAGING: ${stg.length} views`, tone: 'store', dir: 'grid', cols: 3, children: stg.map(chip('s')) },
        { type: 'group', id: 'ln-core', title: 'MARTS', tone: 'serve', dir: 'grid', cols: 2, children: [...core.map(chip('c')), { type: 'item' as const, id: 'l-fct', icon: 'table', title: 'fct_order_lines', tone: 'serve' as const }] },
      ],
    },
    {
      type: 'group', id: 'docs', badge: 2, title: 'What dbt docs holds', tone: 'neutral', children: [
        { type: 'table', id: 'd', columns: ['file', 'from'], rows: [
          ['manifest.json', 'the project: models, refs, tests'], ['catalog.json', 'Snowflake: columns, types, rows'],
          { cells: ['index.html', 'a site: lineage, docs, search'], tone: 'serve' },
        ] },
      ],
    },
    {
      type: 'group', id: 'select', badge: 3, title: 'Lineage, as dbt selects it', tone: 'infra', children: [
        { type: 'table', id: 'sel', columns: ['dbt --select', 'answers'], rows: [
          ['+fct_order_lines', 'where does it come from?'],
          ['stg_orders+', 'what breaks if it changes?'],
        ] },
      ],
    },
  ],
  edges: [
    { from: 'ln-raw', to: 'ln-stg', label: 'source()' },
    { from: 'ln-stg', to: 'ln-core', label: 'ref()' },
  ],
})
