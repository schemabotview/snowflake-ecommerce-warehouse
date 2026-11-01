import { projectTree } from '../tree'

// The project as Course 6 grows it: model/ holds the star, written by hand (Course 7 rebuilds it
// with dbt). Earlier folders closed.
const BEFORE = ['setup/warehouses.sql', 'setup/grants.sql', 'load/as-loader.sh', 'load/copy.sql', 'shop/schema.sql', 'queries/caches.sql', 'client.py', 'requirements.txt']
const ADDED = ['setup/transform_grants.sql', 'model/as-transformer.sh', 'queries/grain.sql', 'model/fct_order_lines.sql', 'queries/fact_check.sql', 'model/dim_date.sql', 'model/dim_customer.sql',
  'model/dim_product.sql', 'queries/dims.sql', 'queries/keys.sql', 'queries/star_vs_snowflake.sql', 'queries/two_dates.sql', 'queries/revenue_by_month.sql']

export function modelTree(last: string, active: string, fresh: string[] = [active]) {
  return projectTree([...BEFORE, ...ADDED.slice(0, ADDED.indexOf(last) + 1)], {
    active, fresh, made: { 'data/': 'shopwave_gen' }, closed: ['load', 'shop', 'setup'], trim: ['queries'],
  })
}
