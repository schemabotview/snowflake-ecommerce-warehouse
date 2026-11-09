import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { rowsOf } from '../recorded'
import { star } from '../star'
import { modelTree } from './tree'
import session from '../../../spine/model/05-dims/session.txt?raw'
import sql from '../../../spine/model/05-dims/project/model/dim_date.sql?raw'

// §6.5 — Dimensions: date (generated), customer, product (recorded on Snowflake).
const s = star({ stage: 'natural', dims: ['date', 'customer', 'product'] })
const dims = rowsOf(session, 'DIM', 3, 0, 3)

export const modelDims: SceneModel = ideFrame2({
  model: 'TODO',
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
  ],
  edges: s.edges,
})
