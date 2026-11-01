import type { SceneModel } from '@graphlearning/graphl-flow'
import { transformElt } from './elt'
import { transformProject } from './project'
import { transformStaging } from './staging'
import { transformDag } from './dag-scene'
import { transformMaterialisations } from './materialisations'
import { transformIncremental } from './incremental'
import { transformGenericTests } from './generic-tests'
import { transformCustomTests } from './custom-tests'
import { transformDocs } from './docs'

export const transformScenes: Record<string, SceneModel> = {
  'transform-elt': transformElt,
  'transform-project': transformProject,
  'transform-staging': transformStaging,
  'transform-dag': transformDag,
  'transform-materialisations': transformMaterialisations,
  'transform-incremental': transformIncremental,
  'transform-generic-tests': transformGenericTests,
  'transform-custom-tests': transformCustomTests,
  'transform-docs': transformDocs,
}
