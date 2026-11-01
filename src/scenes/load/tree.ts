import { projectTree } from '../tree'

// The project as Course 5 grows it: load/ is the loader's; earlier folders closed.
const BEFORE = ['setup/databases.sql', 'setup/grants.sql', 'setup/keys.sh', 'setup/monitors.sql', 'setup/roles.sql', 'setup/service_users.sql', 'setup/users.sql', 'setup/warehouses.sql',
  'shop/schema.sql', 'load/products.sql', 'queries/caches.sql', 'client.py', 'requirements.txt']
const ADDED = ['load/as-loader.sh', 'setup/stage.sql', 'load/upload.sh', 'queries/landing.sql', 'setup/file_formats.sql', 'queries/peek.sql', 'load/tables.sql', 'load/copy.sql',
  'queries/copy_again.sql', 'load/returns_table.sql', 'queries/validate_returns.sql', 'load/clicks.sql', 'queries/devices.sql', 'queries/infer.sql', 'queries/both_shapes.sql',
  'load/returns.sql', 'queries/reasons.sql', 'load/pipe.sql', 'queries/pipe_status.sql']

export function loadTree(last: string, active: string, fresh: string[] = [active]) {
  return projectTree([...BEFORE, ...ADDED.slice(0, ADDED.indexOf(last) + 1)], {
    active, fresh, made: { 'data/': 'shopwave_gen', 'logs/': undefined }, closed: ['shop', 'setup'], trim: ['queries', 'setup'],
  })
}
