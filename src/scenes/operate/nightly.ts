import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { rowsOf } from '../recorded'
import { operateTree } from './tree'
import session from '../../../spine/operate/02-nightly/session.txt?raw'
import code from '../../../spine/operate/02-nightly/project/ops/nightly.sh?raw'

// §12.2 — Scheduling dbt: tonight's run, started by hand (recorded on Snowflake). The build fails on
// Course 7's two planted-fault tests; dbt's own summary is read from SYSTEM$GET_DBT_LOG.
const runs = rowsOf(session, 'NAME', 3, 0, 2)
const said = rowsOf(session, 'DBT_SAID', 1, 0, 3)
const state = (name: string) => runs.find((r) => r[0] === name)?.[1] ?? '…'

export const operateNightly: SceneModel = ideFrame({
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
    { type: 'note', id: 'skip', tone: 'consume', text: 'A failed test stops what is built on its data. Better yesterday’s right rows on the dashboard than today’s wrong ones.' },
    { type: 'note', id: 'log', tone: 'neutral', text: 'dbt’s own log stays with the task’s query: SYSTEM$GET_DBT_LOG reads it back, line by line.' },
    { type: 'note', id: 'known', tone: 'neutral', text: 'These are Course 7’s planted faults: orders with no payment, and orders paid twice. The task failing is the alarm working.' },
  ],
  edges: [
    { from: 'r-snap', to: 'r-build' },
    { from: 'r-build', to: 'r-skip' },
  ],
})
