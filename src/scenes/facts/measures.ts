import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { cell } from '../recorded'
import { factsTree } from './tree'
import session from '../../../spine/facts/07-measures/session.txt?raw'
import sql from '../../../spine/facts/07-measures/project/queries/measures.sql?raw'

// §9.7 — Measures: which sums are allowed (recorded on Snowflake). AOV's two answers and the gold
// count's two answers are the run's.
const n = (column: string) => cell(session, column)

export const factsMeasures: SceneModel = ideFrame2({
  model: 'TODO',
  tree: factsTree('queries/measures.sql', 'queries/measures.sql'),
  editor: { file: 'queries/measures.sql', code: sql },
  session,
  keep: ['$ bash model', ['| ORDERS', '| 18014'], ['| GOLD_SUMMED_WRONG', '+--------------------------------------+']],
  side: [
    {
      type: 'group', id: 'kinds', badge: 1, title: 'Three kinds of measure', tone: 'infra', children: [
        { type: 'table', id: 'k', columns: ['kind', 'example', 'sum across'], rows: [
          { cells: ['additive', 'revenue, quantity', 'anything'], tone: 'serve' },
          ['semi-additive', 'customers at month end', 'customers, not months'],
          { cells: ['non-additive', 'AOV, a ratio', 'nothing: sum the parts'], tone: 'consume' },
        ] },
      ],
    },
    {
      type: 'group', id: 'aov', badge: 2, title: 'Average order value', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'a', columns: ['', 'EUR'], rows: [
          { cells: ['revenue ÷ orders', n('AOV_RIGHT')], tone: 'serve' },
          { cells: ['the average of each customer’s AOV', n('AOV_AVERAGED_WRONG')], tone: 'consume' },
        ] },
      ],
    },
    {
      type: 'group', id: 'gold', badge: 3, title: 'Gold customers', sub: 'from the run', tone: 'neutral', children: [
        { type: 'table', id: 'g', columns: ['', 'customers'], rows: [
          { cells: ['at the end of December', n('GOLD_AT_YEAR_END')], tone: 'serve' },
          { cells: ['summed over twelve month ends', n('GOLD_SUMMED_WRONG')], tone: 'consume' },
        ] },
      ],
    },
  ],
  edges: [],
})
