import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { transformTree } from './tree'
import session from '../../../spine/transform/02-project/session.txt?raw'
import profiles from '../../../spine/transform/02-project/project/dbt/profiles.yml?raw'

// §7.2 — A dbt project: dbt_project.yml, profiles.yml as SVC_DBT by key pair, the sources (recorded
// on Snowflake: dbt debug connects).
export const transformProject: SceneModel = ideFrame2({
  model: 'A project, a profile, a role: dbt reaches Snowflake',
  tree: transformTree('dbt/models/staging/_sources.yml', 'dbt/profiles.yml', ['requirements.txt', 'dbt/dbt_project.yml', 'dbt/profiles.yml', 'dbt/macros/generate_schema_name.sql', 'dbt/models/staging/_sources.yml']),
  editor: { file: 'dbt/profiles.yml', code: profiles },
  session,
  keep: ['$ cd dbt', '$ dbt --version', 'dbt v2 is available', '$ dbt debug', ['account: SHOPWAVE-DW', 'user: SVC_DBT'], 'Connection test: [OK connection ok]'],
  side: [
    {
      type: 'group', id: 'chain', badge: 1, title: 'From a project to Snowflake', tone: 'infra', children: [
        { type: 'item', id: 'c-project', icon: 'file', title: 'dbt_project.yml', sub: 'where each layer lands' },
        { type: 'item', id: 'c-profile', icon: 'key', title: 'profiles.yml', sub: 'SVC_DBT, by key pair' },
        { type: 'item', id: 'c-role', icon: 'users', title: 'TRANSFORMER', sub: 'on WH_TRANSFORM: Course 4’s grants' },
        { type: 'item', id: 'c-db', icon: 'snowflakedb', title: 'ANALYTICS', sub: 'STAGING, MARTS' },
      ],
    },
    {
      type: 'group', id: 'files', badge: 2, title: 'The project’s first files', tone: 'neutral', children: [
        { type: 'table', id: 'f', columns: ['file', 'says'], rows: [
          ['_sources.yml', 'RAW’s 8 tables'], ['generate_schema…', 'schema names as is'],
          { cells: ['profiles.yml', 'no secret in it'], tone: 'serve' },
        ] },
      ],
    },
  ],
  edges: [
    { from: 'c-project', to: 'c-profile', label: 'profile: shopwave' },
    { from: 'c-profile', to: 'c-role' },
    { from: 'c-role', to: 'c-db' },
  ],
})
