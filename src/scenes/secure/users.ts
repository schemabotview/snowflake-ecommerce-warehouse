import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { rowsOf } from '../recorded'
import { secureTree } from './tree'
import session from '../../../spine/secure/01-users/session.txt?raw'
import sql from '../../../spine/secure/01-users/project/setup/users.sql?raw'

// §4.1 — Users and roles (recorded on Snowflake). Ana is the administrator who opened the trial (the
// recorder's user); Ravi is a new colleague with nothing but PUBLIC.
const mine = rowsOf(session, 'MY_ROLES', 1, 0, 6).map(([r]) => r)
// A new user's only role, PUBLIC, is implicit: SHOW GRANTS TO USER lists nothing (the run says "No data").
const ravi = /RAVIS_ROLES/.test(session) ? rowsOf(session, 'RAVIS_ROLES', 1).map(([r]) => r) : /No data/.test(session) ? ['none: PUBLIC only, implicit'] : ['…']

export const secureUsers: SceneModel = ideFrame({
  tree: secureTree('queries/who.sql', 'setup/users.sql', ['setup/users.sql', 'queries/who.sql']),
  editor: { file: 'setup/users.sql', code: sql },
  session,
  keep: ['$ snow sql -f setup/users.sql', '$ snow sql -f queries/who.sql', ['| ME', '| ANA'], 'SHOW GRANTS TO USER RAVI', 'No data'],
  side: [
    {
      type: 'group', id: 'model', badge: 1, title: 'Privileges go to roles, roles go to users', tone: 'infra', children: [
        { type: 'item', id: 'u-user', icon: 'user', title: 'A user', sub: 'a person or a program: who logs in' },
        { type: 'item', id: 'u-role', icon: 'users', title: 'Roles', sub: 'granted to the user; one active at a time' },
        { type: 'item', id: 'u-priv', icon: 'key', title: 'Privileges', sub: 'USAGE, SELECT, CREATE … on objects' },
      ],
    },
    {
      type: 'group', id: 'two', badge: 2, title: 'Two users, from the run', tone: 'neutral', dir: 'row', children: [
        { type: 'table', id: 'ana', title: 'ANA may use', rows: mine.map((r) => ({ cells: [r] })) },
        { type: 'table', id: 'ravi', title: 'RAVI may use', rows: ravi.map((r) => ({ cells: [r] })) },
      ],
    },
    { type: 'note', id: 'never', tone: 'neutral', text: 'Never grant a privilege to a user directly: grant it to a role, and the role to the user. Change the team, not every person.' },
  ],
  edges: [
    { from: 'u-user', to: 'u-role', label: 'is granted' },
    { from: 'u-role', to: 'u-priv', label: 'holds' },
  ],
})
