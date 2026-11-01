import type { SceneModel } from '@graphlearning/graphl-flow'
import { keepLines, terminal } from '../ide'
import { rowsOf } from '../recorded'
import session from '../../../spine/model/02-grain/session.txt?raw'

// §6.2 — ◆ the grain. Order 2293 (a German order, 3 lines, paid twice by the generator's planted
// double payment) counted at three grains (recorded on Snowflake). WH_TRANSFORM is created here.
const grains = rowsOf(session, 'GRAIN', 3, 0, 3)
const term = terminal(session)
// Keep the commands and the answer; the warehouse's creation and grants fold.
const keep = keepLines(term, ['$ snow sql -f setup/warehouses.sql', '$ snow sql -f setup/transform_grants.sql', '$ bash model/as-transformer.sh -f queries/grain.sql', ['| GRAIN', '| order lines x payments']])

export const modelGrain: SceneModel = {
  title: 'The grain: what one row means',
  sub: 'One real order, 2293, counted three ways. Only one is right for sales',
  dir: 'row',
  nodes: [
    {
      type: 'group', id: 'left', bare: true, children: [
        {
          type: 'group', id: 'ways', bare: true, dir: 'row', children: [
            {
              type: 'group', id: 'g-order', badge: 1, title: 'One row per order', tone: 'ingest', children: [
                { type: 'item', id: 'o-1', icon: 'card', title: '1 row', sub: 'the total: which product? unknown' },
              ],
            },
            {
              type: 'group', id: 'g-line', badge: 2, title: 'One row per order line', sub: 'the grain we choose', tone: 'serve', children: [
                { type: 'item', id: 'l-1', icon: 'table', title: '3 rows', sub: 'each line its product and price' },
              ],
            },
            {
              type: 'group', id: 'g-pay', badge: 3, title: 'Lines × payments', sub: 'two grains mixed', tone: 'consume', children: [
                { type: 'item', id: 'p-1', icon: 'zap', title: '6 rows', sub: 'every line counted once per payment' },
              ],
            },
          ],
        },
        {
          type: 'group', id: 'result', badge: 4, title: 'Order 2293, from the run', tone: 'neutral', children: [
            { type: 'table', id: 'grains', columns: ['grain', 'rows', 'EUR'], rows: grains },
          ],
        },
        { type: 'note', id: 'rule', tone: 'serve', text: 'Choose the most detailed grain the source records, and never join a fact to anything with more rows per key: the sums double without an error.' },
      ],
    },
    {
      type: 'group', id: 'proof', title: 'The run', icon: 'terminal', tone: 'neutral', children: [
        { type: 'code', id: 'out', terminal: true, filename: 'terminal — shopwave-dw', code: term, show: keep },
      ],
    },
  ],
  edges: [
    { from: 'g-order', to: 'g-line', label: 'finer' },
    { from: 'g-line', to: 'g-pay', label: 'fan-out' },
  ],
}
