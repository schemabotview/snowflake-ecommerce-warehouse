import type { Course } from '../types'
import { scd } from './01-scd'
import { snapshots } from './02-snapshots'
import { prices } from './03-prices'
import { pointInTime } from './04-point-in-time'
import { late } from './05-late'
import { currency } from './06-currency'
import { streams } from './07-streams'
import { dynamicTables } from './08-dynamic-tables'

export const history: Course = {
  id: 'history',
  title: 'Time in the warehouse',
  sections: [scd, snapshots, prices, pointInTime, late, currency, streams, dynamicTables],
}
