import { projectTree } from '../tree'

// Course 2's project, as the chain grows it (spine/how-snowflake-runs/*/project).
const FILES = ['queries/layers.sql', 'queries/wake.sql', 'queries/partitions.sql', 'queries/where.sql', 'setup/warehouses.sql', 'client.py', 'requirements.txt']

/** The explorer at a step: the files it holds, `active` open, `fresh` added by this section. */
export function howTree(upTo: string, active: string, fresh: string[] = [active]) {
  const order = ['queries/layers.sql', 'setup/warehouses.sql', 'queries/wake.sql', 'queries/partitions.sql', 'queries/where.sql', 'client.py']
  const have = FILES.filter((f) => f === 'requirements.txt' ? upTo === 'client.py' : order.indexOf(f) <= order.indexOf(upTo))
  return projectTree(have, { active, fresh })
}
