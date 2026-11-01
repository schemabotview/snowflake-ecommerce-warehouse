import type { SceneModel, Table } from '@graphlearning/graphl-flow'
import { terminal } from '../ide'
import session from '../../../spine/history/01-scd/session.txt?raw'

// §8.1 — ◆ SCD types. Customer 81's own row and moves, as the generator wrote them (runs locally);
// the four types are Kimball's (Kimball & Ross, ch. 5), each applied to that one customer.
const base = session.match(/^81,(\w\w),/m)![1]
const moves = [...session.matchAll(/^81,(\S+) \S+,(country|tier),(\w\w),(\w+)$/gm)].map(([, day, field, country, tier]) => ({ day, field, country, tier }))
const move = moves.find((m) => m.field === 'country')!
const t = (id: string, title: string, columns: string[], rows: string[][], tone: Table['tone']): Table => ({ type: 'table', id, title, columns, rows, tone })

export const historyScd: SceneModel = {
  title: 'Slowly changing dimensions: what to do when a customer moves',
  sub: `Customer 81 moved from ${base} to ${move.country} on ${move.day}. Four ways a dimension can answer`,
  dir: 'row',
  nodes: [
    {
      type: 'group', id: 'types', bare: true, dir: 'grid', cols: 2, children: [
        { type: 'group', id: 'type0', badge: 0, title: 'Type 0: never change', sub: 'the value at signup, forever', tone: 'neutral', children: [t('t0', 'dim_customer', ['id', 'country'], [['81', base]], 'neutral')] },
        { type: 'group', id: 'type1', badge: 1, title: 'Type 1: overwrite', sub: 'history lost: every old order moves too', tone: 'consume', children: [t('t1', 'dim_customer', ['id', 'country'], [['81', move.country]], 'consume')] },
        { type: 'group', id: 'type2', badge: 2, title: 'Type 2: a new row per version', sub: 'history kept: this course', tone: 'serve', children: [t('t2', 'dim_customer', ['key', 'id', 'country', 'valid from', 'valid to'], [['k1', '81', base, 'signup', move.day], ['k2', '81', move.country, move.day, '—']], 'serve')] },
        { type: 'group', id: 'type3', badge: 3, title: 'Type 3: a column for the previous value', sub: 'one step of history', tone: 'infra', children: [t('t3', 'dim_customer', ['id', 'country', 'previous'], [['81', move.country, base]], 'infra')] },
      ],
    },
    {
      type: 'group', id: 'proof', title: 'Customer 81 in the shop’s data', icon: 'terminal', tone: 'neutral', children: [
        { type: 'code', id: 'out', terminal: true, filename: 'terminal — shopwave-dw', code: terminal(session) },
      ],
    },
  ],
}
