import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { isRecorded } from '../recorded'
import { transformTree } from './tree'
import session from '../../../spine/transform/08-custom-tests/session.txt?raw'
import sql from '../../../spine/transform/08-custom-tests/project/dbt/tests/assert_has_payment.sql?raw'

// §7.8 — Custom tests: the generator's planted unpaid and double-paid orders, found (recorded on
// Snowflake: both tests are expected to FAIL, and the counts are the run's).
// dbt 1.12 reports `FAIL 191 assert_has_payment`; a test that passed would say PASS.
const got = (test: string) => isRecorded(session) ? (session.match(new RegExp(`(?:FAIL|PASS) (\\d+)? ?${test}`))?.[1] ?? '0') : '…'

export const transformCustomTests: SceneModel = ideFrame2({
  model: 'Custom tests: the business’s own rules',
  tree: transformTree('dbt/tests/assert_has_payment.sql', 'dbt/tests/assert_has_payment.sql', ['dbt/tests/assert_has_payment.sql', 'dbt/tests/assert_paid_once.sql']),
  editor: { file: 'dbt/tests/assert_has_payment.sql', code: sql },
  session,
  keep: ['$ dbt test --select test_type:singular', 'FAIL 191', 'FAIL 55', ['[ERROR]: in test assert_has_payment', 'Got 191'], ['[ERROR]: in test assert_paid_once', 'Got 55'], 'Done. PASS=0'],
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
  ],
  edges: [
    { from: 'w-fail', to: 'w-who' },
    { from: 'w-who', to: 'w-fix' },
  ],
})
