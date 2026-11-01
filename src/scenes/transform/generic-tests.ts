import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { view } from '../fold'
import { fromRun } from '../recorded'
import { transformTree } from './tree'
import session from '../../../spine/transform/07-generic-tests/session.txt?raw'
import yml from '../../../spine/transform/07-generic-tests/project/dbt/models/marts/core/_core.yml?raw'

// §7.7 — Generic tests on the marts (recorded on Snowflake).
// Every test in _core.yml, read from the file itself: model, column, test.
const tests: string[][] = []
let model = '', column = ''
for (const line of yml.split('\n')) {
  const m = line.match(/^  - name: (\w+)/), c = line.match(/^      - name: (\w+)/)
  if (m) model = m[1]
  else if (c) column = c[1]
  const inline = line.match(/^\s+tests: \[(.+)\]/), item = line.match(/^          - (\w+)/)
  if (inline) inline[1].split(',').forEach((t) => tests.push([model, column, t.trim()]))
  if (item) tests.push([model, column, item[1]])
}
const pass = fromRun(session, /PASS=(\d+)/), fail = fromRun(session, /ERROR=(\d+)/)

export const transformGenericTests: SceneModel = ideFrame({
  tree: transformTree('dbt/models/marts/core/_core.yml', 'dbt/models/marts/core/_core.yml'),
  editor: { file: 'dbt/models/marts/core/_core.yml', code: yml, ...view(yml, 'models:', '- name: dim_customer', 1) },
  session,
  side: [
    {
      type: 'group', id: 'onstar', badge: 1, title: 'Tests on the DAG', sub: 'each a query that should return no rows', tone: 'infra', dir: 'row', children: [
        { type: 'item', id: 't-fact', icon: 'table', title: 'fct_order_lines', sub: 'unique, not_null, accepted_values', stack: true },
        {
          type: 'group', id: 't-dims', bare: true, children: [
            { type: 'item', id: 't-cust', icon: 'users', title: 'dim_customer', sub: 'unique key' },
            { type: 'item', id: 't-prod', icon: 'package', title: 'dim_product', sub: 'unique key' },
          ],
        },
      ],
    },
    {
      type: 'group', id: 'all', badge: 2, title: `${tests.length} tests, from _core.yml`, tone: 'neutral', children: [
        { type: 'table', id: 'list', columns: ['model', 'column', 'test'], rows: tests },
      ],
    },
    {
      type: 'group', id: 'kinds', badge: 3, title: 'The four built-in tests', tone: 'neutral', children: [
        { type: 'table', id: 'k', columns: ['test', 'fails when'], rows: [
          ['unique', 'a value appears twice'], ['not_null', 'a value is missing'],
          ['relationships', 'a key has no row in its dimension'], ['accepted_values', 'a status no one expected'],
        ] },
      ],
    },
    { type: 'note', id: 'result', tone: 'serve', text: `From the run: ${pass} passed, ${fail} errors.` },
  ],
  edges: [
    { from: 't-fact', to: 't-cust', label: 'relationships' },
    { from: 't-fact', to: 't-prod', label: 'relationships' },
  ],
})
