import { projectTree } from '../tree'

// The project as Course 12 grows it: ops/ holds the nightly job, the clone, CI and the usage views.
const BEFORE = ['dbt/dbt_project.yml', 'dbt/profiles.yml', 'dbt/models/marts/bi/mart_revenue.sql', 'dbt/models/marts/core/fct_order_lines.sql',
  'govern/masking.sql', 'load/as-loader.sh', 'model/as-transformer.sh', 'setup/grants.sql', 'queries/dashboard.sql']
const ADDED = ['setup/ops_grants.sql', 'ops/snowflake/profiles.yml', 'ops/deploy.sh', 'ops/tasks.sql', 'ops/nightly.sh', 'ops/history.sql',
  'ops/clone.sql', 'ops/undrop.sql', 'dbt/models/marts/bi/_bi.yml', 'ops/ci.sh', 'ops/ci.yml', 'ops/usage.sql']

export function operateTree(last: string, active: string, fresh: string[] = [active]) {
  return projectTree([...BEFORE, ...ADDED.slice(0, ADDED.indexOf(last) + 1)], {
    active, fresh, made: { '.venv/': 'dbt 1.12.6' }, closed: ['govern', 'load', 'model', 'queries'],
    trim: ['setup', 'dbt/models/marts', 'dbt/models/marts/core', 'dbt/models/marts/bi'],
  })
}
