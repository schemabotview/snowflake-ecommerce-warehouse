import type { Course } from '../types'
import { revenue } from './01-revenue'
import { cohorts } from './02-cohorts'
import { metrics } from './03-metrics'
import { masking } from './04-masking'
import { rowAccess } from './05-row-access'
import { secure } from './06-secure'
import { share } from './07-share'
import { dashboard } from './08-dashboard'

export const serve: Course = {
  id: 'serve',
  title: 'Serving BI and a partner',
  sections: [revenue, cohorts, metrics, masking, rowAccess, secure, share, dashboard],
}
