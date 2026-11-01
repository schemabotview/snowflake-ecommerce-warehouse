import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { fromRun } from '../recorded'
import { howTree } from './tree'
import session from '../../../spine/how-snowflake-runs/06-clients/session.txt?raw'
import code from '../../../spine/how-snowflake-runs/06-clients/project/client.py?raw'

// §2.6 — Three clients, one service. The CLI and the Python connector really ask (recorded on
// Snowflake); Snowsight, the web UI, is drawn, never screenshotted (COURSE-PLAN.md, "Frames").
const py = fromRun(session, /^client: (.+)$/m, 'the connector’s CURRENT_CLIENT()')

export const howClients: SceneModel = ideFrame({
  tree: howTree('client.py', 'client.py', ['client.py', 'requirements.txt']),
  editor: { file: 'client.py', code },
  session,
  side: [
    {
      type: 'group', id: 'clients', badge: 1, title: 'Every client', sub: 'the same SQL, the same service', tone: 'consume', dir: 'row', children: [
        { type: 'item', id: 'c-web', icon: 'globe', title: 'Snowsight', sub: 'the web UI', stack: true },
        { type: 'item', id: 'c-cli', icon: 'terminal', title: 'snow', sub: 'this course', stack: true },
        { type: 'item', id: 'c-py', icon: 'python', title: 'Python', sub: py, stack: true },
      ],
    },
    {
      type: 'group', id: 'service', badge: 2, title: 'Cloud services', sub: 'one front door for every client', icon: 'cloud', tone: 'serve', dir: 'row', children: [
        { type: 'item', id: 's-auth', icon: 'key', title: 'Logs in', sub: 'key pair or password' },
        { type: 'item', id: 's-plan', icon: 'workflow', title: 'Plans', sub: 'the same SQL, the same plan' },
      ],
    },
    {
      type: 'group', id: 'compute', badge: 3, title: 'A warehouse', sub: 'only for queries that compute', icon: 'cpu', tone: 'infra', children: [
        { type: 'item', id: 'w-run', icon: 'cpu', title: 'Runs the plan', sub: 'the role’s warehouse, resumed if asleep' },
      ],
    },
    {
      type: 'group', id: 'store', badge: 4, title: 'Storage', icon: 'disk', tone: 'store', children: [
        { type: 'item', id: 'st-parts', icon: 'boxes', title: 'Micro-partitions', sub: 'whichever client asked' },
      ],
    },
    { type: 'note', id: 'drivers', tone: 'neutral', text: 'JDBC, ODBC, Go, Node.js and Spark connectors reach the same service. snow is a Python program built on the Python connector.' },
  ],
  edges: [
    { from: 'c-web', to: 'service' },
    { from: 'c-cli', to: 'service' },
    { from: 'c-py', to: 'service' },
    { from: 'service', to: 'compute', label: 'if it computes' },
    { from: 'compute', to: 'store' },
  ],
})
