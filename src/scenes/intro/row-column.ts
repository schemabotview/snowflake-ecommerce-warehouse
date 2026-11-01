import type { Group, SceneModel } from '@graphlearning/graphl-flow'
import { terminal } from '../ide'
import session from '../../../spine/intro/02-row-column/session.txt?raw'

// §1.2 — ◆ OLTP vs OLAP. The lab stores 2026's order lines twice, as rows (CSV) and as columns
// (Parquet), and measures what each layout must read for an analyst's question and for a shop's.
// Every number is read from the run (runs locally).
const num = (re: RegExp) => {
  const m = session.match(re)
  if (!m) throw new Error(`row-column.ts: ${re} not in the session`)
  return m[1]
}
const rows = num(/order_items, 2026: ([\d,]+) rows/)
const rowAll = num(/by row {4}: reads +([\d,]+) bytes, every column/)
const colTwo = num(/by column : reads +([\d,]+) bytes, qty and unit_price/)
const colShare = num(/qty and unit_price \((\d+%)\)/)
const rowOne = num(/by row {4}: reads +([\d,]+) bytes, its lines/)
const colOne = num(/by column : reads +([\d,]+) bytes, 5 column chunks/)
const chunks = [...session.matchAll(/^ {4}(\w+) +([\d,]+) bytes$/gm)].map(([, name, bytes]) => ({ cells: [name, bytes], tone: name === 'qty' || name === 'unit_price' ? 'serve' as const : undefined }))

const oltp: Group = {
  type: 'group', id: 'oltp', badge: 1, title: 'By row: OLTP', sub: 'the shop: one order at a time', icon: 'postgresql', tone: 'source', children: [
    { type: 'item', id: 'r-one', icon: 'card', title: `One order: ${rowOne} bytes`, sub: 'its lines sit side by side', tone: 'serve' },
    { type: 'item', id: 'r-all', icon: 'search', title: `Revenue for the year: ${rowAll} bytes`, sub: 'every column of every row, to use two', tone: 'consume' },
    { type: 'item', id: 'r-model', icon: 'table', title: 'Normalised', sub: 'each fact once, many tables, joined per question' },
  ],
}
const olap: Group = {
  type: 'group', id: 'olap', badge: 2, title: 'By column: OLAP', sub: 'the warehouse: all orders at once', icon: 'snowflakedb', tone: 'store', children: [
    { type: 'item', id: 'c-all', icon: 'chart', title: `Revenue for the year: ${colTwo} bytes`, sub: `two columns, compressed: ${colShare} of the row store`, tone: 'serve' },
    { type: 'item', id: 'c-one', icon: 'boxes', title: `One order: ${colOne} bytes`, sub: 'a piece of all five columns, rebuilt', tone: 'consume' },
    { type: 'item', id: 'c-model', icon: 'layers', title: 'Dimensional', sub: 'facts at a grain, dimensions around them' },
  ],
}
const file: Group = {
  type: 'group', id: 'chunks', badge: 3, title: 'The column store’s file', sub: 'Parquet, zstd: what each column costs to read', icon: 'file', tone: 'neutral', dir: 'row', children: [
    { type: 'table', id: 'chunk-sizes', columns: ['column', 'bytes'], rows: chunks },
    { type: 'note', id: 'chunk-note', tone: 'serve', text: `Revenue reads only qty and unit_price, ${colTwo} bytes. A row store has no such choice: every value of a row sits between the two it needs.` },
  ],
}

export const introRowColumn: SceneModel = {
  title: 'OLTP vs OLAP: the same rows, stored for different questions',
  sub: `2026’s ${rows} order lines, stored by row and by column, and what each must read`,
  dir: 'row',
  nodes: [
    { type: 'group', id: 'left', bare: true, children: [{ type: 'group', id: 'cmp', bare: true, dir: 'row', children: [oltp, olap] }, file] },
    {
      type: 'group', id: 'proof', title: 'The lab, run', icon: 'terminal', tone: 'neutral', children: [
        { type: 'code', id: 'out', terminal: true, filename: 'terminal — row-column lab', code: terminal(session) },
      ],
    },
  ],
  edges: [{ from: 'oltp', to: 'olap', label: 'the question changes' }],
}
