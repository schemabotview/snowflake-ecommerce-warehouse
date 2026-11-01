import type { Course } from '../types'
import { types } from './01-types'
import { lifecycle } from './02-lifecycle'
import { returns } from './03-returns'
import { sessions } from './04-sessions'
import { funnel } from './05-funnel'
import { monthly } from './06-monthly'
import { measures } from './07-measures'
import { factless } from './08-factless'

export const facts: Course = {
  id: 'facts',
  title: 'Every kind of fact',
  sections: [types, lifecycle, returns, sessions, funnel, monthly, measures, factless],
}
