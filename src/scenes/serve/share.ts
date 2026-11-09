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
  model: 'TODO',
  tree: serveTree('govern/brightline.sql', 'govern/brightline.sql', ['govern/share.sql', 'govern/reader.sh', 'govern/reader_locator.sh', 'govern/as-brightline.sh', 'govern/brightline.sql']),
  editor: { file: 'govern/brightline.sql', code: sql },
  session,
  keep: ['| OUTBOUND', ['| CAMPAIGN_ID', '| spring-sale'], 'does not exist or not authorized'],
  side: [
    {
      type: 'group', id: 'path', badge: 1, title: 'A share: read in place, never copied', tone: 'infra', children: [
        { type: 'item', id: 'p-view', icon: 'lock', title: 'BI.CAMPAIGN_STATS', sub: 'Shopwave’s secure view' },
        { type: 'item', id: 'p-share', icon: 'branch', title: 'Share SHOPWAVE_CAMPAIGNS', sub: 'grants on the view, nothing else' },
        { type: 'item', id: 'p-reader', icon: 'building', title: 'Brightline’s reader account', sub: 'Shopwave owns it and pays its compute' },
      ],
    },
    {
      type: 'group', id: 'out', badge: 2, title: 'The share', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 's', columns: ['kind', 'name', 'to'], rows: share },
      ],
    },
    {
      type: 'group', id: 'in', badge: 3, title: 'Inside Brightline’s account', sub: 'from the run', tone: 'serve', children: [
        { type: 'table', id: 'c', columns: ['campaign', 'visits', 'buying'], rows: seen },
      ],
    },
  ],
  edges: [
    { from: 'p-view', to: 'p-share' },
    { from: 'p-share', to: 'p-reader' },
  ],
})
