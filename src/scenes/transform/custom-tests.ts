import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { isRecorded } from '../recorded'
import { transformTree } from './tree'
import session from '../../../spine/transform/08-custom-tests/session.txt?raw'
import sql from '../../../spine/transform/08-custom-tests/project/dbt/tests/assert_has_payment.sql?raw'

// §7.8 — Custom tests: the generator's planted unpaid and double-paid orders, found (recorded on
// Snowflake: both tests are expected to FAIL, and the counts are the run's).
const got = (test: string) => isRecorded(session) ? (session.match(new RegExp(`Failure in test ${test}[\\s\\S]*?Got (\\d+) results?`))?.[1] ?? '0') : '…'

export const transformCustomTests: SceneModel = ideFrame({
  tree: transformTree('dbt/tests/assert_has_payment.sql', 'dbt/tests/assert_has_payment.sql', ['dbt/tests/assert_has_payment.sql', 'dbt/tests/assert_paid_once.sql']),
  editor: { file: 'dbt/tests/assert_has_payment.sql', code: sql },
  session,
  side: [
    {
      type: 'group', id: 'found', badge: 1, title: 'The failing rows, found', sub: 'from the run', tone: 'consume', children: [
        { type: 'table', id: 'fails', columns: ['test', 'rows', 'planted'], rows: [
          ['paid orders have a payment', got('assert_has_payment'), '1% unpaid'],
          ['orders paid once', got('assert_paid_once'), '0.3% paid twice'],
        ] },
      ],
    },
    {
      type: 'group', id: 'flow', badge: 2, title: 'What a failing test means', tone: 'neutral', children: [
        { type: 'item', id: 'w-fail', icon: 'zap', title: 'dbt test fails', sub: 'and stops a nightly build (Course 12)' },
        { type: 'item', id: 'w-who', icon: 'users', title: 'Someone decides', sub: 'bad data, or a rule the business needs' },
        { type: 'item', id: 'w-fix', icon: 'check', title: 'Fixed at the source, or modelled', sub: 'paid_date_key takes the FIRST payment (6.8)' },
      ],
    },
    {
      type: 'group', id: 'vs', badge: 3, title: 'Generic or custom', tone: 'infra', children: [
        { type: 'table', id: 'gc', columns: ['', 'generic', 'custom'], rows: [
          ['written as', 'a line of YAML', 'a SELECT in tests/'],
          ['checks', 'the model’s structure', 'a business rule'],
          { cells: ['fails when', 'it returns rows', 'it returns rows'], tone: 'serve' },
        ] },
      ],
    },
    { type: 'note', id: 'names', tone: 'neutral', text: 'A singular test’s file name is its name in dbt’s output: assert_has_payment, assert_paid_once.' },
  ],
  edges: [
    { from: 'w-fail', to: 'w-who' },
    { from: 'w-who', to: 'w-fix' },
  ],
})
