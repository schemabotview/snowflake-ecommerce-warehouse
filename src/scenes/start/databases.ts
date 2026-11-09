import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { startTree } from './tree'
import session from '../../../spine/start/02-databases/session.txt?raw'
import sql from '../../../spine/start/02-databases/project/setup/databases.sql?raw'

// §3.2 — Databases and schemas: RAW and ANALYTICS (recorded on Snowflake).
const schema = (id: string, title: string, sub: string) => ({ type: 'item' as const, id, icon: 'folder', title, sub })

export const startDatabases: SceneModel = ideFrame2({
  model: 'Account, database, schema, object',
  tree: startTree('setup/databases.sql', 'setup/databases.sql'),
  editor: { file: 'setup/databases.sql', code: sql },
  session,
  keep: ['$ snow sql', ['| database_name', '| RAW           | SHOPWAVE']],
  side: [
    { type: 'item', id: 'acct', icon: 'snowflakedb', title: 'Account shopwave-dw', sub: 'holds databases' },
    {
      type: 'group', id: 'dbs', bare: true, dir: 'row', children: [
        {
          type: 'group', id: 'db-raw', icon: 'database', title: 'RAW', sub: 'as loaded, never edited', tone: 'ingest', children: [
            schema('s-shopwave', 'SHOPWAVE', 'one table per source'),
          ],
        },
        {
          type: 'group', id: 'db-analytics', icon: 'database', title: 'ANALYTICS', sub: 'what we make of it', tone: 'store', children: [
            schema('s-staging', 'STAGING', 'cleaned (Course 7)'),
            schema('s-marts', 'MARTS', 'the star (Course 6)'),
            schema('s-bi', 'BI', 'served (Course 11)'),
          ],
        },
      ],
    },
    {
      type: 'group', id: 'objects', title: 'Inside a schema', sub: 'every object has a three-part name', icon: 'layers', tone: 'neutral', children: [
        { type: 'table', id: 'kinds', columns: ['object', 'example'], rows: [
          ['table', 'RAW.SHOPWAVE.PRODUCTS'], ['view', 'STAGING.STG_ORDERS'], ['stage', 'RAW.SHOPWAVE.LANDING'],
          ['format', 'RAW.SHOPWAVE.FF_CSV'],
        ] },
      ],
    },
  ],
  edges: [
    { from: 'acct', to: 'db-raw' },
    { from: 'acct', to: 'db-analytics' },
  ],
})
