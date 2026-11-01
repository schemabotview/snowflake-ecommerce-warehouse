import type { SceneModel } from '@graphlearning/graphl-flow'
import { loadStage } from './stage'
import { loadFormats } from './formats'
import { loadCopy } from './copy'
import { loadOnce } from './once'
import { loadValidate } from './validate'
import { loadVariant } from './variant'
import { loadSchemaChange } from './schema-change'
import { loadLatin1 } from './latin1'
import { loadSnowpipe } from './snowpipe'

export const loadScenes: Record<string, SceneModel> = {
  'load-stage': loadStage,
  'load-formats': loadFormats,
  'load-copy': loadCopy,
  'load-once': loadOnce,
  'load-validate': loadValidate,
  'load-variant': loadVariant,
  'load-schema-change': loadSchemaChange,
  'load-latin1': loadLatin1,
  'load-snowpipe': loadSnowpipe,
}
