import type { SceneModel } from '@graphlearning/graphl-flow'
import { historyScd } from './scd'
import { historySnapshots } from './snapshots'
import { historyPrices } from './prices'
import { historyPointInTime } from './point-in-time'
import { historyLate } from './late'
import { historyCurrency } from './currency'
import { historyStreams } from './streams'
import { historyDynamic } from './dynamic'

export const historyScenes: Record<string, SceneModel> = {
  'history-scd': historyScd,
  'history-snapshots': historySnapshots,
  'history-prices': historyPrices,
  'history-point-in-time': historyPointInTime,
  'history-late': historyLate,
  'history-currency': historyCurrency,
  'history-streams': historyStreams,
  'history-dynamic': historyDynamic,
}
