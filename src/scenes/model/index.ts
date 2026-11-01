import type { SceneModel } from '@graphlearning/graphl-flow'
import { modelKimball } from './kimball'
import { modelGrain } from './grain'
import { modelBusMatrix } from './bus-matrix'
import { modelFact } from './fact'
import { modelDims } from './dims'
import { modelKeys } from './keys'
import { modelSnowflakeSchema } from './snowflake-schema'
import { modelRoles } from './roles'
import { modelAnswer } from './answer'

export const modelScenes: Record<string, SceneModel> = {
  'model-kimball': modelKimball,
  'model-grain': modelGrain,
  'model-bus-matrix': modelBusMatrix,
  'model-fact': modelFact,
  'model-dims': modelDims,
  'model-keys': modelKeys,
  'model-snowflake-schema': modelSnowflakeSchema,
  'model-roles': modelRoles,
  'model-answer': modelAnswer,
}
