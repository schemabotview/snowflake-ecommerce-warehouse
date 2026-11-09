import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { rowsOf } from '../recorded'
import { serveTree } from './tree'
import session from '../../../spine/serve/07-share/session.txt?raw'
import sql from '../../../spine/serve/07-share/project/govern/brightline.sql?raw'

// §11.7 — Sharing with Brightline (recorded on Snowflake): a share, a READER account Shopwave owns,
// and the view read from inside it. The reader's locator is normalised by the recorder (BL67890).
const seen = rowsOf(session, 'CAMPAIGN_ID', 3, 0, 4)
const share = rowsOf(session, 'kind', 3, 0, 1)

export const serveShare: SceneModel = ideFrame2({
  model: 'A share: another account reads in place',
  tree: serveTree('govern/brightline.sql', 'govern/brightline.sql', ['govern/share.sql', 'govern/reader.sh', 'govern/reader_locator.sh', 'govern/as-brightline.sh', 'govern/brightline.sql']),
  editor: { file: 'govern/brightline.sql', code: sql },
  session,
  keep: ['| OUTBOUND', ['| CAMPAIGN_ID', '| spring-sale'], 'does not exist or not authorized'],
  side: [
    {
      type: 'group', id: 'path', badge: 1, title: 'A share: read in place, never copied', tone: 'infra', dir: 'row', children: [
        { type: 'item', id: 'p-view', icon: 'lock', title: 'BI.CAMPAIGN_STATS', sub: 'the secure view', stack: true },
        { type: 'item', id: 'p-share', icon: 'branch', title: 'SHOPWAVE_CAMPAIGNS', sub: 'the share: grants only', stack: true },
        { type: 'item', id: 'p-reader', icon: 'building', title: 'Brightline', sub: 'a reader account', stack: true },
      ],
    },
    { type: 'table', title: 'The share (from the run)', id: 's', columns: ['kind', 'name', 'to'], rows: share },
    {
      type: 'group', id: 'in', badge: 2, title: 'Inside Brightline’s account', sub: 'from the run', tone: 'serve', children: [
        { type: 'table', id: 'c', columns: ['campaign', 'visits', 'buying'], rows: seen },
      ],
    },
  ],
  edges: [
    { from: 'p-view', to: 'p-share' },
    { from: 'p-share', to: 'p-reader' },
    { from: 'p-share', to: 's' },
  ],
})
