import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { isRecorded, PENDING } from '../recorded'
import { operateTree } from './tree'
import session from '../../../spine/operate/05-ci/session.txt?raw'
import yml from '../../../spine/operate/05-ci/project/ops/ci.yml?raw'

// §12.5 — CI on a clone (recorded on Snowflake): the workflow file is shown; its steps were run here,
// by ops/ci.sh, not on GitHub (the owner's choice: no repository secret). Test results are dbt's.
const flat = session.replace(/^(.{80})\n/gm, '$1')
const results = isRecorded(session)
  ? [...flat.matchAll(/\d+ of \d+ (PASS|FAIL|OK created sql table model) (\S+)/g)].map(([, s, what]) => [what.replace(/__.*/, ''), s.startsWith('OK') ? 'built' : s])
  : [[PENDING, PENDING]]

export const operateCi: SceneModel = ideFrame2({
  model: 'TODO',
  tree: operateTree('ops/ci.yml', 'ops/ci.yml', ['dbt/models/marts/bi/_bi.yml', 'ops/ci.sh', 'ops/ci.yml']),
  editor: { file: 'ops/ci.yml', code: yml },
  session,
  keep: ['ANALYTICS_CI_42 successfully created', '1 of 4 OK created', '3 of 4 PASS', '4 of 4 PASS', 'Done. PASS=4', 'ANALYTICS_CI_42 successfully dropped'],
  side: [
    {
      type: 'group', id: 'flow', badge: 1, title: 'A pull request, checked on a clone', tone: 'infra', children: [
        { type: 'item', id: 'c-pr', icon: 'branch', title: 'Pull request 42', sub: 'three tests for the revenue mart' },
        { type: 'item', id: 'c-clone', icon: 'database', title: 'Clone production', sub: 'ANALYTICS_CI_42, in seconds' },
        { type: 'item', id: 'c-build', icon: 'workflow', title: 'Build and test the change', sub: 'mart_revenue and what depends on it' },
        { type: 'item', id: 'c-drop', icon: 'check', title: 'Drop the clone', sub: 'nothing left behind' },
      ],
    },
    {
      type: 'group', id: 'res', badge: 2, title: 'What dbt built and tested', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 't', columns: ['node', 'result'], rows: results },
      ],
    },
  ],
  edges: [
    { from: 'c-pr', to: 'c-clone' },
    { from: 'c-clone', to: 'c-build' },
    { from: 'c-build', to: 'c-drop' },
  ],
})
