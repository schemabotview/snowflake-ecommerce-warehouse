import { projectTree } from '../tree'

// The project as Course 7 grows it: dbt/ is the analytics team's.
const BEFORE = ['model/fct_order_lines.sql', 'load/copy.sql', 'setup/grants.sql', 'shop/schema.sql', 'queries/caches.sql', 'client.py']
const ADDED = ['requirements.txt', 'dbt/dbt_project.yml', 'dbt/profiles.yml', 'dbt/macros/generate_schema_name.sql', 'dbt/models/staging/_sources.yml',
  'dbt/models/staging/stg_orders.sql', 'dbt/models/staging/stg_order_items.sql', 'dbt/models/staging/stg_clicks.sql', 'dbt/models/staging/stg_customers.sql',
  'dbt/models/staging/stg_payments.sql', 'dbt/models/staging/stg_products.sql', 'dbt/models/marts/core/dim_customer.sql', 'dbt/models/marts/core/dim_date.sql',
  'dbt/models/marts/core/dim_product.sql', 'dbt/models/marts/core/fct_order_lines.sql', 'dbt/models/marts/core/int_first_payment.sql', 'dbt/dag.py',
  'queries/materialised.sql', 'dbt/models/marts/core/_core.yml', 'dbt/tests/assert_paid_once.sql', 'dbt/tests/assert_has_payment.sql', 'dbt/lineage.py']

export function transformTree(last: string, active: string, fresh: string[] = [active], made: Record<string, string | undefined> = {}) {
  return projectTree([...BEFORE, ...ADDED.slice(0, ADDED.indexOf(last) + 1)], {
    active, fresh, made: { '.venv/': 'dbt 1.12.6', ...made }, closed: ['load', 'setup', 'shop', 'model', 'queries', 'dbt/macros'], trim: ['dbt/models/staging', 'dbt/models/marts/core'],
  })
}
