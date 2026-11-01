import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { rowsOf } from '../recorded'
import { loadTree } from './tree'
import session from '../../../spine/load/07-schema-change/session.txt?raw'
import sql from '../../../spine/load/07-schema-change/project/queries/both_shapes.sql?raw'

// §5.7 — The June 1 schema change: context.device → context.device_type, + consent (planted in
// shopwave_gen). INFER_SCHEMA on both sides, then one query across both (recorded on Snowflake).
const months = rowsOf(session, 'MONTH', 5, 0, 2)
const inferred = rowsOf(session, 'DAY', 3, 0, 9)

export const loadSchemaChange: SceneModel = ideFrame({
  tree: loadTree('queries/both_shapes.sql', 'queries/both_shapes.sql', ['queries/infer.sql', 'queries/both_shapes.sql']),
  editor: { file: 'queries/both_shapes.sql', code: sql },
  session,
  side: [
    {
      type: 'group', id: 'sides', badge: 1, title: 'The same event, either side of June 1', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'before', title: 'May 31', rows: [['event_type'], { id: 'device', cells: ['context.device'] }, ['items']] },
        { type: 'table', id: 'after', title: 'June 1', rows: [['event_type'], { id: 'device_type', cells: ['context.device_type'], tone: 'consume' }, ['items'], { cells: ['consent'], tone: 'serve' }] },
      ],
    },
    {
      type: 'group', id: 'counts', badge: 2, title: 'Counted across both', sub: 'from the run: events per field, by month', tone: 'neutral', children: [
        { type: 'table', id: 'm', columns: ['month', 'device', 'device_type', 'either', 'consent'], rows: months },
      ],
    },
    {
      type: 'group', id: 'infer', badge: 3, title: 'INFER_SCHEMA, either side', sub: 'from the run: the top-level fields', tone: 'neutral', children: [
        { type: 'table', id: 'fields', columns: ['day', 'field', 'type'], rows: inferred },
      ],
    },
    { type: 'note', id: 'raw-keeps', tone: 'neutral', text: 'RAW keeps both shapes exactly as sent. One name for the device is staging’s job (Course 7), not the loader’s.' },
  ],
  edges: [{ from: 'before.device', to: 'after.device_type', label: 'renamed' }],
})
