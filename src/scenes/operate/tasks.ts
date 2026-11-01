import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { rowsOf } from '../recorded'
import { operateTree } from './tree'
import session from '../../../spine/operate/01-tasks/session.txt?raw'
import sql from '../../../spine/operate/01-tasks/project/ops/tasks.sql?raw'

// §12.1 — Tasks (recorded on Snowflake): the dbt project deployed INTO Snowflake as an object, and
// a two-task graph that runs it. The root's schedule is left suspended (a trial must not spend).
const tasks = rowsOf(session, 'name', 3, 0, 2)

export const operateTasks: SceneModel = ideFrame({
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
    { type: 'note', id: 'child', tone: 'neutral', text: 'A child task has no schedule of its own: it runs when the task before it finishes, so one schedule drives the whole graph.' },
    { type: 'note', id: 'where', tone: 'serve', text: 'dbt runs INSIDE Snowflake: snow dbt deploy copied the project in as SHOPWAVE_DBT, so no server has to stay awake for the night.' },
    { type: 'note', id: 'role', tone: 'neutral', text: 'A task runs as the role that owns it, TRANSFORMER: the one role the row access policy lets read every customer.' },
  ],
  edges: [
    { from: 't-cron', to: 't-snap' },
    { from: 't-snap', to: 't-build' },
  ],
})
