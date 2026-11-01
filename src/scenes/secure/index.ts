import type { SceneModel } from '@graphlearning/graphl-flow'
import { secureUsers } from './users'
import { secureSystemRoles } from './system-roles'
import { secureCustomRoles } from './custom-roles'
import { secureGrants } from './grants'
import { secureLeastPrivilege } from './least-privilege'
import { secureRefused } from './refused'
import { secureServiceUsers } from './service-users'
import { secureNetwork } from './network'

export const secureScenes: Record<string, SceneModel> = {
  'secure-users': secureUsers,
  'secure-system-roles': secureSystemRoles,
  'secure-custom-roles': secureCustomRoles,
  'secure-grants': secureGrants,
  'secure-least-privilege': secureLeastPrivilege,
  'secure-refused': secureRefused,
  'secure-service-users': secureServiceUsers,
  'secure-network': secureNetwork,
}
