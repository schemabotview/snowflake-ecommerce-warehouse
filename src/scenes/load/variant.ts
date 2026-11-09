import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { cell, rowsOf } from '../recorded'
import { loadTree } from './tree'
import session from '../../../spine/load/06-variant/session.txt?raw'
import sql from '../../../spine/load/06-variant/project/queries/devices.sql?raw'

// §5.6 — Semi-structured data: every click event into one VARIANT column; queried by path (recorded on Snowflake).
const events = cell(session, 'EVENTS'), files = cell(session, 'FILES')
const byDevice = rowsOf(session, 'EVENT_TYPE', 3, 0, 6)

export const loadVariant: SceneModel = ideFrame2({
  model: 'VARIANT: a JSON document in one column',
  tree: loadTree('queries/devices.sql', 'queries/devices.sql', ['load/clicks.sql', 'queries/devices.sql']),
  editor: { file: 'queries/devices.sql', code: sql },
  session,
  keep: ['$ bash load/as-loader.sh -f load/clicks.sql', '| 8613', '$ bash load/as-loader.sh -f queries/devices.sql', ['| EVENT_TYPE', '| page_view    | mobile']],
  side: [
    {
      type: 'group', id: 'shape', badge: 1, title: 'JSON into one column', sub: `${events} events from ${files} files`, tone: 'ingest', children: [
        { type: 'item', id: 'j-line', icon: 'file', title: 'One JSON line', sub: '{"event_type": …, "context": {"device": …}}' },
        { type: 'item', id: 'j-var', icon: 'table', title: 'V  VARIANT', sub: 'stored as columns inside, for speed' },
        { type: 'item', id: 'j-path', icon: 'search', title: 'V:context.device::string', sub: 'a path, then a cast' },
      ],
    },
    {
      type: 'group', id: 'jan', badge: 2, title: 'January’s events by type and device', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'counts', columns: ['event_type', 'device', 'events'], rows: byDevice },
      ],
    },
  ],
  edges: [
    { from: 'j-line', to: 'j-var', label: 'COPY' },
    { from: 'j-var', to: 'j-path', label: 'query' },
  ],
})
