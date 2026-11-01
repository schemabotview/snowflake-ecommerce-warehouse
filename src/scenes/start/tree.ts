import { projectTree } from '../tree'

// The project as Course 3 grows it (spine/start/*/project): Course 2's files stay, closed.
const BEFORE = ['queries/layers.sql', 'queries/wake.sql', 'queries/partitions.sql', 'queries/where.sql', 'setup/warehouses.sql', 'client.py', 'requirements.txt']
const ADDED = ['shop/schema.sql', 'shop/load.sql', 'queries/shop_tables.sql', 'setup/databases.sql', 'load/products.sql', 'queries/categories.sql', 'queries/sizing.sql', 'queries/state.sql', 'setup/monitors.sql', 'queries/caches.sql']

/** The explorer at a step: everything up to and including `last`, `active` open, `fresh` new. The
 *  queries/ folder is trimmed to what the section is about: it outgrows the pane. */
export function startTree(last: string, active: string, fresh: string[] = [active], made: Record<string, string | undefined> = {}) {
  const files = [...BEFORE, ...ADDED.slice(0, ADDED.indexOf(last) + 1)]
  return projectTree(files, { active, fresh, made, trim: ['queries'] })
}
