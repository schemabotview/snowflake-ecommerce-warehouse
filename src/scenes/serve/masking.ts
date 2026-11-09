import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { cell } from '../recorded'
import { serveTree } from './tree'
import session from '../../../spine/serve/04-masking/session.txt?raw'
import sql from '../../../spine/serve/04-masking/project/govern/masking.sql?raw'

// §11.4 — A masking policy on the customer's email (recorded on Snowflake): one column, two readers.
const email = (after: number) => cell(session, 'EMAIL', 0, after)

export const serveMasking: SceneModel = ideFrame2({
  model: 'A masking policy: one column, two readers',
  tree: serveTree('queries/masked.sql', 'govern/masking.sql', ['setup/masking_grants.sql', 'govern/masking.sql', 'dbt/models/marts/core/dim_customer.sql', 'queries/masked.sql']),
  editor: { file: 'govern/masking.sql', code: sql },
  session,
  keep: ['1 of 1 OK created', ['| CUSTOMER_ID', '| 81'], 'USE ROLE ANALYST', ['| CUSTOMER_ID', '| 81']],
  side: [
    {
      type: 'group', id: 'how', badge: 1, title: 'A policy on a column', tone: 'infra', children: [
        { type: 'item', id: 'm-pol', icon: 'shield', title: 'PII_EMAIL', sub: 'a function of the value and who asks' },
        { type: 'item', id: 'm-col', icon: 'table', title: 'DIM_CUSTOMER.EMAIL', sub: 'attached by dbt’s post_hook, every build' },
        { type: 'item', id: 'm-read', icon: 'users', title: 'Every query, every tool', sub: 'masked before the result leaves' },
      ],
    },
    {
      type: 'group', id: 'two', badge: 2, title: 'Customer 81’s email, two readers', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'r', columns: ['role', 'email'], rows: [['TRANSFORMER', email(0)], { cells: ['ANALYST', email(1)], tone: 'serve' }] },
      ],
    },
    { type: 'item', id: 'hook', icon: 'workflow', tone: 'consume', title: 'dbt replaces the table every run', sub: 'a post_hook re-attaches the policy' },
    { type: 'item', id: 'role', icon: 'users', title: 'CURRENT_ROLE(), not the secondary roles', sub: 'the one role the session works as' },
  ],
  edges: [
    { from: 'm-pol', to: 'm-col' },
    { from: 'm-col', to: 'm-read' },
  ],
})
