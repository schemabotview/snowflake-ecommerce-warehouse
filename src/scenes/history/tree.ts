import { projectTree } from '../tree'

// The project as Course 8 grows it.
const BEFORE = ['dbt/dbt_project.yml', 'dbt/profiles.yml', 'dbt/models/marts/core/fct_order_lines.sql', 'dbt/models/marts/core/dim_customer.sql', 'dbt/models/marts/core/dim_product.sql',
  'load/as-loader.sh', 'model/as-transformer.sh', 'setup/grants.sql', 'queries/caches.sql']
const ADDED = ['load/customer_changes.sql', 'load/customers_as_of.sql', 'load/month_ends.sh', 'dbt/snapshots/snap_customers.yml', 'queries/customer_81.sql',
  'load/product_prices.sql', 'dbt/models/staging/stg_product_prices.sql', 'queries/price_history.sql', 'queries/point_in_time.sql', 'queries/late.sql',
  'dbt/models/marts/core/dim_currency.sql', 'dbt/models/marts/core/fct_payments.sql', 'queries/currency.sql', 'setup/stream_grants.sql', 'load/order_changes.sql',
  'setup/dynamic_grants.sql', 'queries/dynamic.sql']

export function historyTree(last: string, active: string, fresh: string[] = [active]) {
  return projectTree([...BEFORE, ...ADDED.slice(0, ADDED.indexOf(last) + 1)], {
    active, fresh, made: { '.venv/': 'dbt 1.12.6' }, closed: ['setup', 'model'], trim: ['queries', 'load', 'dbt/models/marts/core', 'dbt/models/staging'],
  })
}
