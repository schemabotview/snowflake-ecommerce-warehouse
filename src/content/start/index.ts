import type { Course } from '../types'
import { shopDb } from './01-shop-db'
import { databases } from './02-databases'
import { firstTable } from './03-first-table'
import { sizing } from './04-sizing'
import { budget } from './05-budget'
import { caches } from './06-caches'
import { projectMap } from './07-project-map'

export const start: Course = {
  id: 'start',
  title: 'The source, and a first warehouse',
  sections: [shopDb, databases, firstTable, sizing, budget, caches, projectMap],
}
