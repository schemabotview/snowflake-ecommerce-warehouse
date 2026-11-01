import type { SceneModel } from '@graphlearning/graphl-flow'
import { terminal } from '../ide'
import session from '../../../spine/secure/02-system-roles/session.txt?raw'

// §4.2 — ◆ the system roles. SHOW ROLES on the account (recorded on Snowflake); the hierarchy and
// what each role is for are doc-cited: docs.snowflake.com/en/user-guide/security-access-control-overview.
const role = (id: string, title: string, sub: string, tone?: 'consume' | 'serve' | 'infra' | 'store') => ({ type: 'item' as const, id, icon: 'users', title, sub, tone })

export const secureSystemRoles: SceneModel = {
  title: 'The system roles: every account starts with five',
  sub: 'Higher roles inherit everything granted to the roles under them',
  dir: 'row',
  nodes: [
    {
      type: 'group', id: 'tree', title: 'The hierarchy', sub: 'doc-cited: an arrow points from a role to one it inherits', icon: 'users', tone: 'neutral', children: [
        role('r-account', 'ACCOUNTADMIN', 'everything: billing, monitors, every object. Use rarely', 'consume'),
        {
          type: 'group', id: 'middle', bare: true, dir: 'row', children: [
            {
              type: 'group', id: 'sec', bare: true, children: [
                role('r-security', 'SECURITYADMIN', 'grants: MANAGE GRANTS on everything', 'infra'),
                role('r-user', 'USERADMIN', 'creates users and roles', 'infra'),
              ],
            },
            {
              type: 'group', id: 'sys', bare: true, children: [
                role('r-sys', 'SYSADMIN', 'creates warehouses, databases', 'store'),
                role('r-custom', 'custom roles', 'LOADER, TRANSFORMER, ANALYST: next', 'store'),
              ],
            },
          ],
        },
        role('r-public', 'PUBLIC', 'every user has it; grant it nothing', 'serve'),
      ],
    },
    {
      type: 'group', id: 'proof', title: 'The account’s roles', icon: 'terminal', tone: 'neutral', children: [
        { type: 'code', id: 'out', terminal: true, filename: 'terminal — shopwave-dw', code: terminal(session) },
      ],
    },
  ],
  edges: [
    { from: 'r-account', to: 'r-security' },
    { from: 'r-account', to: 'r-sys' },
    { from: 'r-security', to: 'r-user' },
    { from: 'r-sys', to: 'r-custom' },
    { from: 'r-user', to: 'r-public' },
    { from: 'r-custom', to: 'r-public' },
  ],
}
