import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { cell, rowsOf } from '../recorded'
import { loadTree } from './tree'
import session from '../../../spine/load/08-latin1/session.txt?raw'
import sql from '../../../spine/load/08-latin1/project/load/returns.sql?raw'

// §5.8 — Latin-1 returns: the right encoding, ON_ERROR = CONTINUE (recorded on Snowflake). The byte
// values are ISO-8859-1's and UTF-8's own.
const loaded = cell(session, 'LOADED'), rejected = cell(session, 'REJECTED')
const reasons = rowsOf(session, 'REASON', 2, 0, 6)

export const loadLatin1: SceneModel = ideFrame({
  tree: loadTree('queries/reasons.sql', 'load/returns.sql', ['load/returns.sql', 'queries/reasons.sql']),
  editor: { file: 'load/returns.sql', code: sql },
  session,
  side: [
    {
      type: 'group', id: 'bytes', badge: 1, title: 'One byte, two readings', sub: 'the ö in “Größe”', tone: 'consume', children: [
        { type: 'item', id: 'b-byte', icon: 'file', title: 'byte F6', sub: 'what the warehouse’s system wrote' },
        {
          type: 'group', id: 'readings', bare: true, dir: 'row', children: [
            { type: 'item', id: 'b-latin', icon: 'check', title: 'Latin-1: ö', sub: 'one byte, one letter', stack: true, tone: 'serve' },
            { type: 'item', id: 'b-utf', icon: 'zap', title: 'UTF-8: invalid', sub: 'ö is C3 B6 there', stack: true, tone: 'consume' },
          ],
        },
      ],
    },
    {
      type: 'group', id: 'split', badge: 2, title: 'The load', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'counts', columns: ['loaded', 'rejected'], rows: [[loaded, rejected]] },
        { type: 'table', id: 'reasons', columns: ['reason', 'returns'], rows: reasons },
      ],
    },
    { type: 'note', id: 'kept', tone: 'neutral', text: 'The rejected rows are not lost: the files stay on @LANDING, and VALIDATE lists every rejected row of this load.' },
  ],
  edges: [
    { from: 'b-byte', to: 'b-latin' },
    { from: 'b-byte', to: 'b-utf' },
  ],
})
