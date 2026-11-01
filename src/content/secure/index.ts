import type { Course } from '../types'
import { users } from './01-users'
import { systemRoles } from './02-system-roles'
import { customRoles } from './03-custom-roles'
import { grants } from './04-grants'
import { leastPrivilege } from './05-least-privilege'
import { refused } from './06-refused'
import { serviceUsers } from './07-service-users'
import { network } from './08-network'

export const secure: Course = {
  id: 'secure',
  title: 'Roles before data',
  sections: [users, systemRoles, customRoles, grants, leastPrivilege, refused, serviceUsers, network],
}
