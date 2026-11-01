import type { SceneModel } from '@graphlearning/graphl-flow'
import { introQuestions } from './questions'
import { introRowColumn } from './row-column'
import { introWhatWeBuild } from './what-we-build'

export const introScenes: Record<string, SceneModel> = {
  'intro-questions': introQuestions,
  'intro-row-column': introRowColumn,
  'intro-what-we-build': introWhatWeBuild,
}
