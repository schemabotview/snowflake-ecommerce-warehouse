import type { SceneModel } from '@graphlearning/graphl-flow'
import { operateTasks } from './tasks'
import { operateNightly } from './nightly'
import { operateClone } from './clone'
import { operateUndrop } from './undrop'
import { operateCi } from './ci'
import { operateUsage } from './usage'
import { operateNext } from './next'

export const operateScenes: Record<string, SceneModel> = {
  'operate-tasks': operateTasks,
  'operate-nightly': operateNightly,
  'operate-clone': operateClone,
  'operate-undrop': operateUndrop,
  'operate-ci': operateCi,
  'operate-usage': operateUsage,
  'operate-next': operateNext,
}
