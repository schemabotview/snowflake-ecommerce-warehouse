import type { Course } from '../types'
import { layers } from './01-layers'
import { warehouse } from './02-warehouse'
import { partitions } from './03-partitions'
import { where } from './04-where'
import { editions } from './05-editions'
import { clients } from './06-clients'
import { cost } from './07-cost'

export const howSnowflakeRuns: Course = {
  id: 'how-snowflake-runs',
  title: 'How Snowflake is built',
  sections: [layers, warehouse, partitions, where, editions, clients, cost],
}
