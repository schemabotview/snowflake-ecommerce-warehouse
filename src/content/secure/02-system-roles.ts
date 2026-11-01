import type { Section } from '../types'

export const systemRoles: Section = {
  id: 'system-roles',
  title: "The system roles",
  scene: 'secure-system-roles',
  narration:
    "Every Snowflake account starts with the same five roles, arranged in a hierarchy, and every role higher up inherits everything granted to the roles below it. The terminal asks the account for its roles, which roles each one inherits, and which roles the account administrator holds. At the top is account admin. It can do everything, including billing and the resource monitor from the last course, which is why it should be used rarely, by few people, and never as anyone's default. Under it are two branches. On the left, security admin, which can grant any privilege on any object, and under it user admin, which creates users and roles. That branch decides who may do what. On the right, sys admin, which creates warehouses and databases, everything the warehouse is made of. That branch builds things. At the bottom is public. Every user has it automatically, so anything granted to public is granted to everyone; the rule is to grant it nothing. The custom roles this course creates next go under sys admin, so that the people who administer the account can see and manage everything the teams build. There is a sixth system role in larger companies, org admin, which manages the accounts of a whole organisation; a single trial account does not need it. With the hierarchy in mind, Shopwave can add roles of its own, one for each team.",
}
