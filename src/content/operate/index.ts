import type { Course } from '../types'
import { tasks } from './01-tasks'
import { nightly } from './02-nightly'
import { clone } from './03-clone'
import { undrop } from './04-undrop'
import { ci } from './05-ci'
import { usage } from './06-usage'
import { next } from './07-next'

export const operate: Course = {
  id: 'operate',
  title: 'Every night, and safe change',
  sections: [tasks, nightly, clone, undrop, ci, usage, next],
}
