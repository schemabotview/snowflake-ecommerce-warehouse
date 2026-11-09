import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { cell } from '../recorded'
import { startTree } from './tree'
import session from '../../../spine/start/05-budget/session.txt?raw'
import sql from '../../../spine/start/05-budget/project/setup/monitors.sql?raw'

// §3.5 — A budget that stops spend: RM_MONTHLY (recorded on Snowflake). WH_TRANSFORM and WH_BI do
// not exist yet: drawn muted where they will attach.
const quota = cell(session, 'credit_quota'), used = cell(session, 'used_credits')

export const startBudget: SceneModel = ideFrame2({
  model: 'A monitor caps the credits',
  tree: startTree('setup/monitors.sql', 'setup/monitors.sql'),
  editor: { file: 'setup/monitors.sql', code: sql },
  session,
  keep: ['$ snow sql', ['| name       | credit_quota', '| RM_MONTHLY'], ['| name    | resource_monitor', '| WH_LOAD']],
  side: [
    { type: 'item', id: 'rm', icon: 'gauge', title: 'RM_MONTHLY', sub: '50 credits a month, from today' },
    {
      type: 'group', id: 'whs', bare: true, dir: 'row', children: [
        { type: 'item', id: 'm-load', icon: 'cpu', title: 'WH_LOAD', sub: 'attached', stack: true },
        { type: 'item', id: 'm-transform', icon: 'cpu', title: 'WH_TRANSFORM', sub: 'Course 7', stack: true, muted: true },
        { type: 'item', id: 'm-bi', icon: 'cpu', title: 'WH_BI', sub: 'Course 4', stack: true, muted: true },
      ],
    },
    { type: 'table', id: 'thresholds', title: 'What happens as credits are used', tone: 'consume', columns: ['used', 'credits', 'action'], rows: [
      ['80%', '40', 'NOTIFY admins'],
      { cells: ['100%', '50', 'SUSPEND'], tone: 'consume' },
    ] },
    {
      type: 'group', id: 'now', title: 'RM_MONTHLY today', sub: 'from SHOW RESOURCE MONITORS', icon: 'gauge', tone: 'infra', children: [
        { type: 'table', id: 'quota', columns: ['quota', 'used so far'], rows: [[quota, used]] },
      ],
    },
  ],
  edges: [
    { from: 'rm', to: 'm-load' },
    { from: 'rm', to: 'm-transform', dashed: true },
    { from: 'rm', to: 'm-bi', dashed: true },
    { from: 'whs', to: 'thresholds', label: 'as credits are used' },
  ],
})
