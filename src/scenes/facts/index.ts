import type { SceneModel } from '@graphlearning/graphl-flow'
import { factsTypes } from './types'
import { factsLifecycle } from './lifecycle'
import { factsReturns } from './returns'
import { factsSessions } from './sessions'
import { factsFunnel } from './funnel'
import { factsMonthly } from './monthly'
import { factsMeasures } from './measures'
import { factsFactless } from './factless'

export const factsScenes: Record<string, SceneModel> = {
  'facts-types': factsTypes,
  'facts-lifecycle': factsLifecycle,
  'facts-returns': factsReturns,
  'facts-sessions': factsSessions,
  'facts-funnel': factsFunnel,
  'facts-monthly': factsMonthly,
  'facts-measures': factsMeasures,
  'facts-factless': factsFactless,
}
