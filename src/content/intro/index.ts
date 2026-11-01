import type { Course } from '../types'
import { questions } from './01-questions'
import { rowColumn } from './02-row-column'
import { whatWeBuild } from './03-what-we-build'

export const intro: Course = {
  id: 'intro',
  title: 'Why a warehouse',
  sections: [questions, rowColumn, whatWeBuild],
}
