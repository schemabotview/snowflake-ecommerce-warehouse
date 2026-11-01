import { projectTree } from '../tree'

// The project as Course 10 grows it: queries that measure, two setup files, one load test.
const BEFORE = ['dbt/dbt_project.yml', 'dbt/profiles.yml', 'dbt/macros/generate_schema_name.sql', 'dbt/models/staging/stg_clicks.sql',
  'dbt/models/marts/core/fct_order_lines.sql', 'dbt/models/marts/core/dim_date.sql', 'dbt/models/marts/core/dim_product.sql', 'dbt/models/marts/fct_sessions.sql',
  'load/as-loader.sh', 'model/as-transformer.sh', 'setup/grants.sql', 'queries/eligibility.sql']
const ADDED = ['queries/profile.sql', 'queries/pruning.sql', 'queries/clustering.sql', 'setup/perform_grants.sql', 'setup/scale.sql', 'perform/black_friday.py',
  'queries/mv.sql', 'queries/acceleration.sql', 'dbt/macros/set_query_tag.sql', 'queries/credits.sql']

export function performTree(last: string, active: string, fresh: string[] = [active]) {
  return projectTree([...BEFORE, ...ADDED.slice(0, ADDED.indexOf(last) + 1)], {
    active, fresh, made: { '.venv/': 'dbt 1.12.6' }, closed: ['load', 'model', 'dbt/models/staging'],
    trim: ['queries', 'setup', 'dbt/models/marts', 'dbt/models/marts/core'],
  })
}
