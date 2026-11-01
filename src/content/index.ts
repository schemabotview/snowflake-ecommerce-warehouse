import { intro } from './intro'
import { howSnowflakeRuns } from './how-snowflake-runs'
import { start } from './start'
import { secure } from './secure'
import { load } from './load'
import { model } from './model'
import { transform } from './transform'
import { history } from './history'
import type { Course, Section } from './types'

// Course registry, in syllabus order. One course per chapter of COURSE-PLAN.md; a course is
// registered here only once it is authored.
export const COURSES: Record<string, Course> = {
  [intro.id]: intro,
  [howSnowflakeRuns.id]: howSnowflakeRuns,
  [start.id]: start,
  [secure.id]: secure,
  [load.id]: load,
  [model.id]: model,
  [transform.id]: transform,
  [history.id]: history,
}

export type { Course, Section }

// slugOf / allSections are the shell's — the slug rule (`<courseId>-<sectionId>`) is part of the
// route contract every recorder drives, so it cannot be a per-repo decision.
export { slugOf, allSections } from '@graphlearning/shell'

export function getCourse(id: string): Course | undefined {
  return COURSES[id]
}
