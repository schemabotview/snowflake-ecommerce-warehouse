import type { SceneModel } from '@graphlearning/graphl-flow'
import { startShopDb } from './shop-db'
import { startDatabases } from './databases'
import { startFirstTable } from './first-table'
import { startSizing } from './sizing'
import { startBudget } from './budget'
import { startCaches } from './caches'
import { startProjectMap } from './project-map'

export const startScenes: Record<string, SceneModel> = {
  'start-shop-db': startShopDb,
  'start-databases': startDatabases,
  'start-first-table': startFirstTable,
  'start-sizing': startSizing,
  'start-budget': startBudget,
  'start-caches': startCaches,
  'start-project-map': startProjectMap,
}
