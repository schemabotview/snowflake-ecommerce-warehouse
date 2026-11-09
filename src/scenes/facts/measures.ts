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
  model: 'Additive, semi-additive, non-additive',
  tree: factsTree('queries/measures.sql', 'queries/measures.sql'),
  editor: { file: 'queries/measures.sql', code: sql },
  session,
  keep: ['$ bash model', ['| ORDERS', '| 18014'], ['| GOLD_SUMMED_WRONG', '+--------------------------------------+']],
  side: [
    { type: 'table', id: 'k', title: 'Three kinds of measure', columns: ['kind', 'example', 'sum across'], rows: [
      { cells: ['additive', 'revenue', 'anything'], tone: 'serve' },
      ['semi-additive', 'gold at month end', 'customers'],
      { cells: ['non-additive', 'AOV, a ratio', 'nothing'], tone: 'consume' },
    ] },
    {
      type: 'group', id: 'run', bare: true, dir: 'row', children: [
        { type: 'table', id: 'a', title: 'AOV (from the run)', columns: ['', 'EUR'], rows: [
          { cells: ['revenue ÷ orders', n('AOV_RIGHT')], tone: 'serve' },
          { cells: ['avg of AOVs', n('AOV_AVERAGED_WRONG')], tone: 'consume' },
        ] },
        { type: 'table', id: 'g', title: 'Gold (from the run)', columns: ['', 'customers'], rows: [
          { cells: ['December', n('GOLD_AT_YEAR_END')], tone: 'serve' },
          { cells: ['12 months, summed', n('GOLD_SUMMED_WRONG')], tone: 'consume' },
        ] },
      ],
    },
  ],
  edges: [
    { from: 'k', to: 'a' },
    { from: 'k', to: 'g' },
  ],
})
