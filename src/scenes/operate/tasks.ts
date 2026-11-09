import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { rowsOf } from '../recorded'
import { operateTree } from './tree'
import session from '../../../spine/operate/01-tasks/session.txt?raw'
import sql from '../../../spine/operate/01-tasks/project/ops/tasks.sql?raw'

// §12.1 — Tasks (recorded on Snowflake): the dbt project deployed INTO Snowflake as an object, and
// a two-task graph that runs it. The root's schedule is left suspended (a trial must not spend).
const tasks = rowsOf(session, 'name', 3, 0, 2)

export const operateTasks: SceneModel = ideFrame2({
  model: 'A task graph: dbt, scheduled inside Snowflake',
  tree: operateTree('ops/tasks.sql', 'ops/tasks.sql', ['setup/ops_grants.sql', 'ops/snowflake/profiles.yml', 'ops/deploy.sh', 'ops/tasks.sql']),
  editor: { file: 'ops/tasks.sql', code: sql },
  session,
  keep: ['$ bash ops/deploy.sh', 'SHOPWAVE_DBT successfully created', 'Task NIGHTLY_BUILD successfully created', ['| name', '| NIGHTLY_SNAPSHOT']],
  side: [
    {
      type: 'group', id: 'graph', badge: 1, title: 'The nightly task graph', tone: 'infra', children: [
        { type: 'item', id: 't-cron', icon: 'timer', title: 'Every night at 02:00, Berlin', sub: 'the root’s schedule: suspended here' },
        { type: 'item', id: 't-snap', icon: 'clock', title: 'NIGHTLY_SNAPSHOT', sub: 'EXECUTE DBT PROJECT … snapshot' },
        { type: 'item', id: 't-build', icon: 'workflow', title: 'NIGHTLY_BUILD', sub: 'AFTER the snapshot: … build' },
      ],
    },
    {
      type: 'group', id: 'shown', badge: 2, title: 'SHOW TASKS', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 's', columns: ['task', 'schedule', 'state'], rows: tasks.map(([n, s, st]) => [n, s === 'None' ? '—' : s.replace('USING CRON ', ''), st]) },
      ],
    },
    { type: 'item', id: 'where', icon: 'snowflakedb', tone: 'serve', title: 'dbt runs inside Snowflake', sub: 'no server stays awake for the night' },
    { type: 'item', id: 'role', icon: 'users', title: 'A task runs as its owner, TRANSFORMER', sub: 'the role that reads every customer' },
  ],
  edges: [
    { from: 't-cron', to: 't-snap' },
    { from: 't-snap', to: 't-build' },
  ],
})
