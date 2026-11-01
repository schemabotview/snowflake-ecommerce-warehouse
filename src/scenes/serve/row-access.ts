import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { rowsOf } from '../recorded'
import { serveTree } from './tree'
import session from '../../../spine/serve/05-row-access/session.txt?raw'
import sql from '../../../spine/serve/05-row-access/project/govern/row_access.sql?raw'

// §11.5 — A row access policy by country (recorded on Snowflake): one table, two readers.
const all = rowsOf(session, 'COUNTRY', 2, 0, 4)
const region = rowsOf(session, 'COUNTRY', 2, 1, 2)

export const serveRowAccess: SceneModel = ideFrame({
  tree: serveTree('queries/regions.sql', 'govern/row_access.sql', ['setup/region_role.sql', 'govern/row_access.sql', 'dbt/models/marts/core/dim_customer.sql', 'queries/regions.sql']),
  editor: { file: 'govern/row_access.sql', code: sql },
  session,
  keep: [['| COUNTRY', '| IT'], ['| COUNTRY', '| AT']],
  side: [
    {
      type: 'group', id: 'how', badge: 1, title: 'A policy on the rows', tone: 'infra', children: [
        { type: 'item', id: 'a-map', icon: 'table', title: 'REGION_COUNTRIES', sub: 'which role sees which country: data' },
        { type: 'item', id: 'a-pol', icon: 'shield', title: 'BY_REGION on DIM_CUSTOMER.COUNTRY', sub: 'true: the row is returned' },
        { type: 'item', id: 'a-read', icon: 'filter', title: 'Every query sees only its rows', sub: 'as if the others did not exist' },
      ],
    },
    {
      type: 'group', id: 'two', badge: 2, title: 'Customers by country, two readers', sub: 'from the run', tone: 'neutral', dir: 'row', children: [
        { type: 'table', id: 't', title: 'TRANSFORMER', columns: ['country', 'customers'], rows: all },
        { type: 'table', id: 'm', title: 'REGION_MANAGER', columns: ['country', 'customers'], rows: region, tone: 'serve' },
      ],
    },
    { type: 'note', id: 'new', tone: 'neutral', text: 'A manager for France is one more row in REGION_COUNTRIES and one more role: the policy does not change.' },
    { type: 'note', id: 'quiet', tone: 'consume', text: 'No error and no warning: for REGION_MANAGER the other countries’ rows simply do not exist, in every query and every tool.' },
  ],
  edges: [
    { from: 'a-map', to: 'a-pol' },
    { from: 'a-pol', to: 'a-read' },
  ],
})
