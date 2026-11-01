import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { rowsOf } from '../recorded'
import { star } from '../star'
import { modelTree } from './tree'
import session from '../../../spine/model/05-dims/session.txt?raw'
import sql from '../../../spine/model/05-dims/project/model/dim_date.sql?raw'

// §6.5 — Dimensions: date (generated), customer, product (recorded on Snowflake).
const s = star({ stage: 'natural', dims: ['date', 'customer', 'product'] })
const dims = rowsOf(session, 'DIM', 3, 0, 3)

export const modelDims: SceneModel = ideFrame({
  tree: modelTree('queries/dims.sql', 'model/dim_date.sql', ['model/dim_date.sql', 'model/dim_customer.sql', 'model/dim_product.sql', 'queries/dims.sql']),
  editor: { file: 'model/dim_date.sql', code: sql },
  session,
  keep: ['$ bash model/as-transformer.sh -f model/dim_date.sql', 'Table DIM_DATE successfully created', '$ bash model/as-transformer.sh -f queries/dims.sql', ['| DIM ', '| DIM_PRODUCT']],
  side: [
    s.node,
    {
      type: 'group', id: 'sizes', badge: 1, title: 'Each dimension, one key per row', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'dim-counts', columns: ['dimension', 'rows', 'keys'], rows: dims },
      ],
    },
    { type: 'note', id: 'wide', tone: 'neutral', text: 'Dimensions are short and wide; facts are long and narrow. dim_date is made, not loaded: no source sends a calendar.' },
    { type: 'note', id: 'legend', tone: 'neutral', text: 'In the star: PK a dimension’s key, FK a pointer to one, DD a degenerate dimension, + an additive measure.' },
  ],
  edges: s.edges,
})
