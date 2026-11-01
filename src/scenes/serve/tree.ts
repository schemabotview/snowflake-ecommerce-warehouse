import { projectTree } from '../tree'

// The project as Course 11 grows it: marts for BI in dbt/models/marts/bi, policies in govern/.
const BEFORE = ['dbt/dbt_project.yml', 'dbt/profiles.yml', 'dbt/macros/set_query_tag.sql', 'dbt/models/staging/stg_clicks.sql',
  'dbt/models/marts/core/fct_order_lines.sql', 'dbt/models/marts/core/dim_customer.sql', 'dbt/models/marts/fct_sessions.sql',
  'load/as-loader.sh', 'model/as-transformer.sh', 'setup/grants.sql', 'queries/credits.sql', 'perform/black_friday.py']
const ADDED = ['dbt/models/marts/bi/mart_revenue.sql', 'queries/revenue.sql', 'dbt/models/marts/bi/mart_cohorts.sql', 'queries/cohorts.sql',
  'dbt/models/marts/bi/metrics_monthly.sql', 'queries/one_revenue.sql', 'setup/masking_grants.sql', 'govern/masking.sql', 'queries/masked.sql',
  'setup/region_role.sql', 'govern/row_access.sql', 'queries/regions.sql', 'dbt/models/marts/bi/campaign_stats.sql', 'queries/secure.sql',
  'govern/share.sql', 'govern/reader.sh', 'govern/reader_locator.sh', 'govern/as-brightline.sh', 'govern/brightline.sql', 'queries/dashboard.sql']

export function serveTree(last: string, active: string, fresh: string[] = [active]) {
  return projectTree([...BEFORE, ...ADDED.slice(0, ADDED.indexOf(last) + 1)], {
    active, fresh, made: { '.venv/': 'dbt 1.12.6' }, closed: ['load', 'model', 'perform', 'dbt/models/staging'],
    trim: ['queries', 'setup', 'dbt/models/marts', 'dbt/models/marts/core'],
  })
}
