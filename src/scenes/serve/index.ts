import type { SceneModel } from '@graphlearning/graphl-flow'
import { serveRevenue } from './revenue'
import { serveCohorts } from './cohorts'
import { serveMetrics } from './metrics'
import { serveMasking } from './masking'
import { serveRowAccess } from './row-access'
import { serveSecure } from './secure'
import { serveShare } from './share'
import { serveDashboard } from './dashboard'

export const serveScenes: Record<string, SceneModel> = {
  'serve-revenue': serveRevenue,
  'serve-cohorts': serveCohorts,
  'serve-metrics': serveMetrics,
  'serve-masking': serveMasking,
  'serve-row-access': serveRowAccess,
  'serve-secure': serveSecure,
  'serve-share': serveShare,
  'serve-dashboard': serveDashboard,
}
