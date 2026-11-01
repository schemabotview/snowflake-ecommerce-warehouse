import type { SceneModel } from '@graphlearning/graphl-flow'
import { howLayers } from './layers'
import { howWarehouse } from './warehouse'
import { howPartitions } from './partitions'
import { howWhere } from './where'
import { howEditions } from './editions'
import { howClients } from './clients'
import { howCost } from './cost'

export const howScenes: Record<string, SceneModel> = {
  'how-layers': howLayers,
  'how-warehouse': howWarehouse,
  'how-partitions': howPartitions,
  'how-where': howWhere,
  'how-editions': howEditions,
  'how-clients': howClients,
  'how-cost': howCost,
}
