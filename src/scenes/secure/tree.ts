import { projectTree } from '../tree'

// The project as Course 4 grows it: setup/ is where the account's design lives; queries/ trimmed.
const BEFORE = ['shop/schema.sql', 'shop/load.sql', 'load/products.sql', 'setup/databases.sql', 'setup/monitors.sql', 'setup/warehouses.sql', 'client.py', 'requirements.txt',
  'queries/layers.sql', 'queries/wake.sql', 'queries/partitions.sql', 'queries/where.sql', 'queries/shop_tables.sql', 'queries/categories.sql', 'queries/sizing.sql', 'queries/state.sql', 'queries/caches.sql']
const ADDED = ['setup/users.sql', 'queries/who.sql', 'queries/roles.sql', 'setup/roles.sql', 'setup/grants.sql', 'queries/future.sql', 'queries/matrix.sql',
  'queries/refused.sql', 'queries/raw_grants.sql', 'setup/keys.sh', 'setup/service_users.sql', 'queries/whoami.sh']

export function secureTree(last: string, active: string, fresh: string[] = [active]) {
  return projectTree([...BEFORE, ...ADDED.slice(0, ADDED.indexOf(last) + 1)], { active, fresh, trim: ['queries', 'shop', 'load'], closed: ['shop', 'load'] })
}
