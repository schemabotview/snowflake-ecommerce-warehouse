import type { SceneModel } from '@graphlearning/graphl-flow'
import { terminal } from '../ide'
import { cell } from '../recorded'
import session from '../../../spine/how-snowflake-runs/03-partitions/session.txt?raw'

// §2.3 — ◆ micro-partitions. TPC-H's LINEITEM (Snowflake's sample data) copied into a table of our
// own and measured: rows, bytes, partitions (recorded on Snowflake). What a micro-partition is and
// holds is doc-cited: docs.snowflake.com/en/user-guide/tables-clustering-micropartitions.
const rows = cell(session, 'ROW_COUNT'), bytes = cell(session, 'BYTES')
const parts = cell(session, 'PARTITIONS'), depth = cell(session, 'DEPTH')

export const howPartitions: SceneModel = {
  title: 'Micro-partitions: how a Snowflake table is stored',
  sub: 'A table is many small, immutable, columnar files, each described by metadata',
  dir: 'row',
  nodes: [
    {
      type: 'group', id: 'model', bare: true, children: [
        {
          type: 'group', id: 'table', badge: 1, title: 'One table: LINEITEM', sub: 'TPC-H sample data, copied in', icon: 'table', tone: 'source', dir: 'row', children: [
            { type: 'item', id: 't-rows', icon: 'layers', title: `${rows} rows`, sub: 'as loaded, in arrival order' },
            { type: 'item', id: 't-bytes', icon: 'disk', title: `${bytes} bytes`, sub: 'stored, compressed' },
          ],
        },
        {
          type: 'group', id: 'parts', badge: 2, title: `${parts} micro-partitions`, sub: '50–500 MB each before compression; never changed in place', icon: 'boxes', tone: 'store', dir: 'row', children: [
            { type: 'item', id: 'p-col', icon: 'table', title: 'Columnar inside', sub: 'each column stored and compressed apart' },
            { type: 'item', id: 'p-imm', icon: 'lock', title: 'Immutable', sub: 'an UPDATE writes new partitions' },
          ],
        },
        {
          type: 'group', id: 'meta', badge: 3, title: 'Metadata per partition', sub: 'kept by cloud services', icon: 'search', tone: 'serve', dir: 'row', children: [
            { type: 'item', id: 'm-range', icon: 'filter', title: 'Min and max per column', sub: 'lets a query skip partitions' },
            { type: 'item', id: 'm-depth', icon: 'gauge', title: `Clustering depth ${depth}`, sub: 'on L_SHIPDATE: how much ranges overlap' },
          ],
        },
      ],
    },
    {
      type: 'group', id: 'proof', title: 'The table, measured', icon: 'terminal', tone: 'neutral', children: [
        { type: 'code', id: 'out', terminal: true, filename: 'terminal — shopwave-dw', code: terminal(session) },
      ],
    },
  ],
  edges: [
    { from: 'table', to: 'parts', label: 'split on load' },
    { from: 'parts', to: 'meta', label: 'described by' },
  ],
}
