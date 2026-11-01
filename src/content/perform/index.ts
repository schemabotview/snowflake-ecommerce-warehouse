import type { Course } from '../types'
import { profile } from './01-profile'
import { pruning } from './02-pruning'
import { clustering } from './03-clustering'
import { scale } from './04-scale'
import { mv } from './05-mv'
import { acceleration } from './06-acceleration'
import { credits } from './07-credits'

export const perform: Course = {
  id: 'perform',
  title: 'Fast and cheap',
  sections: [profile, pruning, clustering, scale, mv, acceleration, credits],
}
