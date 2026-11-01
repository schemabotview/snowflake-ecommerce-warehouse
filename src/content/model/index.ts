import type { Course } from '../types'
import { kimball } from './01-kimball'
import { grain } from './02-grain'
import { busMatrix } from './03-bus-matrix'
import { fact } from './04-fact'
import { dims } from './05-dims'
import { keys } from './06-keys'
import { snowflakeSchema } from './07-snowflake-schema'
import { roles } from './08-roles'
import { answer } from './09-answer'

export const model: Course = {
  id: 'model',
  title: 'Dimensional modelling',
  sections: [kimball, grain, busMatrix, fact, dims, keys, snowflakeSchema, roles, answer],
}
