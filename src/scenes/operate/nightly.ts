import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { rowsOf } from '../recorded'
import { operateTree } from './tree'
import session from '../../../spine/operate/02-nightly/session.txt?raw'
import code from '../../../spine/operate/02-nightly/project/ops/nightly.sh?raw'

// §12.2 — Scheduling dbt: tonight's run, started by hand (recorded on Snowflake). The build fails on
// Course 7's two planted-fault tests; dbt's own summary is read from SYSTEM$GET_DBT_LOG.
const runs = rowsOf(session, 'NAME', 3, 0, 2)
const said = rowsOf(session, 'DBT_SAID', 1, 0, 3)
const state = (name: string) => runs.find((r) => r[0] === name)?.[1] ?? '…'

export const operateNightly: SceneModel = ideFrame2({
  model: 'TODO',
  tree: operateTree('ops/history.sql', 'ops/nightly.sh', ['ops/nightly.sh', 'ops/history.sql']),
  editor: { file: 'ops/nightly.sh', code, lang: 'shell' },
  session,
  keep: ['$ bash ops/nightly.sh', ['| NAME', '| NIGHTLY_BUILD'], ['| DBT_SAID', '| Done.']],
  side: [
    {
      type: 'group', id: 'run', badge: 1, title: 'Tonight’s run', sub: 'from the run', tone: 'infra', children: [
        { type: 'item', id: 'r-snap', icon: 'check', title: `NIGHTLY_SNAPSHOT: ${state('NIGHTLY_SNAPSHOT')}`, sub: 'customers captured', tone: 'serve' },
        { type: 'item', id: 'r-build', icon: 'workflow', title: `NIGHTLY_BUILD: ${state('NIGHTLY_BUILD')}`, sub: 'two tests found bad rows', tone: 'consume' },
        { type: 'item', id: 'r-skip', icon: 'lock', title: 'What depends on them: skipped', sub: 'those marts keep last night’s rows' },
      ],
    },
    {
      type: 'group', id: 'said', badge: 2, title: 'What dbt said inside the build', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'd', columns: ['dbt'], rows: said },
      ],
    },
  ],
  edges: [
    { from: 'r-snap', to: 'r-build' },
    { from: 'r-build', to: 'r-skip' },
  ],
})
