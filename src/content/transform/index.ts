import type { Course } from '../types'
import { elt } from './01-elt'
import { project } from './02-project'
import { staging } from './03-staging'
import { dag } from './04-dag'
import { materialisations } from './05-materialisations'
import { incremental } from './06-incremental'
import { genericTests } from './07-generic-tests'
import { customTests } from './08-custom-tests'
import { docs } from './09-docs'

export const transform: Course = {
  id: 'transform',
  title: 'dbt on Snowflake',
  sections: [elt, project, staging, dag, materialisations, incremental, genericTests, customTests, docs],
}
