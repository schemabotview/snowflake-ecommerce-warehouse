import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { rowsOf } from '../recorded'
import { secureTree } from './tree'
import session from '../../../spine/secure/07-service-users/session.txt?raw'
import code from '../../../spine/secure/07-service-users/project/setup/keys.sh?raw'

// §4.7 — Service users and key pairs (recorded on Snowflake). Private keys are made on this machine,
// in ~/.keys, and never leave it: only the public halves go to Snowflake. Nothing secret is on screen.
const loader = rowsOf(session, 'WHO', 2, 0)[0], dbt = rowsOf(session, 'WHO', 2, 1)[0]

export const secureServiceUsers: SceneModel = ideFrame({
  tree: secureTree('queries/whoami.sh', 'setup/keys.sh', ['setup/keys.sh', 'setup/service_users.sql', 'queries/whoami.sh']),
  editor: { file: 'setup/keys.sh', code, lang: 'shell' },
  session,
  keep: ['$ bash setup/keys.sh', 'svc_loader: key pair', 'svc_dbt: key pair', '$ bash queries/whoami.sh svc_loader LOADER', '| SVC_LOADER', '$ bash queries/whoami.sh svc_dbt TRANSFORMER', '| SVC_DBT'],
  side: [
    {
      type: 'group', id: 'jwt', badge: 1, title: 'A login with no password', sub: 'key pair authentication', tone: 'infra', children: [
        { type: 'item', id: 'k-private', icon: 'key', title: 'The private key signs', sub: 'a short-lived token (a JWT), here' },
        { type: 'item', id: 'k-public', icon: 'shield', title: 'Snowflake checks it', sub: 'against the public key it was given' },
        { type: 'item', id: 'k-session', icon: 'check', title: 'A session, as that user', sub: 'with its default role' },
      ],
    },
    {
      type: 'group', id: 'who', badge: 2, title: 'Who Snowflake saw', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'seen', columns: ['user', 'role'], rows: [loader, dbt] },
      ],
    },
    {
      type: 'group', id: 'where', badge: 3, title: 'Where each half lives', tone: 'neutral', children: [
        { type: 'table', id: 'halves', columns: ['', 'kept in', 'shown'], rows: [
          { cells: ['private key', '~/.keys, this machine', 'never'], tone: 'consume' },
          { cells: ['public key', 'the user, in Snowflake', 'RSA_PUBLIC_KEY'], tone: 'serve' },
        ] },
      ],
    },
    { type: 'note', id: 'service', tone: 'neutral', text: 'TYPE = SERVICE: a program’s user. It may never have a password, and no human signs in with it.' },
  ],
  edges: [
    { from: 'k-private', to: 'k-public', label: 'signed token' },
    { from: 'k-public', to: 'k-session' },
  ],
})
