import type { SceneModel } from '@graphlearning/graphl-flow'
import { performProfile } from './profile'
import { performPruning } from './pruning'
import { performClustering } from './clustering'
import { performScale } from './scale'
import { performMv } from './mv'
import { performAcceleration } from './acceleration'
import { performCredits } from './credits'

export const performScenes: Record<string, SceneModel> = {
  'perform-profile': performProfile,
  'perform-pruning': performPruning,
  'perform-clustering': performClustering,
  'perform-scale': performScale,
  'perform-mv': performMv,
  'perform-acceleration': performAcceleration,
  'perform-credits': performCredits,
}
