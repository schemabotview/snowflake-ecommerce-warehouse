import { projectTree } from '../tree'

// The project as Course 9 grows it: the facts beside the star, in dbt/models/marts/.
const BEFORE = ['dbt/dbt_project.yml', 'dbt/profiles.yml', 'dbt/models/staging/_sources.yml', 'dbt/models/staging/stg_clicks.sql',
  'dbt/models/marts/core/fct_order_lines.sql', 'dbt/models/marts/core/dim_customer.sql', 'dbt/models/marts/core/dim_product.sql',
  'dbt/snapshots/snap_customers.yml', 'load/as-loader.sh', 'model/as-transformer.sh', 'setup/grants.sql', 'queries/dynamic.sql']
const ADDED = ['load/order_changes_all.sql', 'dbt/models/staging/stg_order_changes.sql', 'dbt/models/marts/fct_order_lifecycle.sql', 'queries/lifecycle.sql',
  'dbt/models/marts/fct_returns.sql', 'queries/returns.sql', 'dbt/models/marts/fct_sessions.sql', 'queries/sessions.sql',
  'dbt/models/marts/fct_funnel.sql', 'queries/funnel.sql', 'dbt/models/marts/fct_customer_monthly.sql', 'queries/monthly.sql',
  'queries/measures.sql', 'load/campaigns.sql', 'dbt/models/marts/fct_eligibility.sql', 'queries/eligibility.sql']

export function factsTree(last: string, active: string, fresh: string[] = [active]) {
  return projectTree([...BEFORE, ...ADDED.slice(0, ADDED.indexOf(last) + 1)], {
    active, fresh, made: { '.venv/': 'dbt 1.12.6' }, closed: ['setup', 'model', 'dbt/snapshots', 'dbt/models/marts/core'],
    trim: ['queries', 'load', 'dbt/models/staging'],
  })
}
