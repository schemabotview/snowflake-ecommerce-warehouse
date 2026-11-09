import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { projectTree } from '../tree'
import session from '../../../spine/how-snowflake-runs/07-cost/session.txt?raw'
import code from '../../../spine/how-snowflake-runs/07-cost/project/cost.py?raw'

// §2.7 — What a query costs. A MODEL (COURSE-PLAN.md, "Verification levels"): Snowflake's documented
// billing rules applied to an assumed day; it runs locally and proves nothing about Snowflake.
const row = (name: string) => {
  const m = session.match(new RegExp(`^${name} +XS +\\d+ +(\\d+) s +(\\d+) s +([\\d.]+)$`, 'm'))
  if (!m) throw new Error(`cost.ts: no ${name} row`)
  return m.slice(1)
}
const bi = row('WH_BI')
const lazy = session.match(/AUTO_SUSPEND 600: +(\d+) s billed, ([\d.]+) credits/)!

export const howCost: SceneModel = ideFrame2({
  model: 'Billed by the second, at least 60',
  tree: projectTree(['cost.py'], { active: 'cost.py' }),
  editor: { file: 'cost.py', code, ...view(code, 'DAY = [', 'return total', 0) },
  session,
  side: [
    {
      type: 'group', id: 'one', badge: 1, title: 'One 3-second dashboard query', sub: 'what WH_BI bills, every 15 minutes', tone: 'infra', children: [
        { type: 'item', id: 'q-resume', icon: 'power', title: 'Resumes: billing starts', sub: 'the 60-second minimum begins' },
        { type: 'item', id: 'q-work', icon: 'cpu', title: '3 s of work', sub: 'the query itself' },
        { type: 'item', id: 'q-idle', icon: 'timer', title: '60 s idle, then suspends', sub: 'AUTO_SUSPEND: billed too' },
      ],
    },
    {
      type: 'group', id: 'bi', badge: 2, title: 'WH_BI over the modelled day', sub: 'a model: published rules, an assumed day', tone: 'neutral', children: [
        { type: 'table', id: 'bi-day', columns: ['', 'seconds', 'credits'], rows: [
          { cells: ['working', bi[0], '—'] },
          { cells: ['billed, 60 s', bi[1], bi[2]], tone: 'serve' },
          { cells: ['billed, 600 s', lazy[1], lazy[2]], tone: 'consume' },
        ] },
      ],
    },
  ],
  edges: [
    { from: 'q-resume', to: 'q-work' },
    { from: 'q-work', to: 'q-idle' },
  ],
})
