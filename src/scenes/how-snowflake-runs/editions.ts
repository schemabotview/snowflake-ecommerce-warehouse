import type { Item, SceneModel } from '@graphlearning/graphl-flow'

// §2.5 — Editions. Doc-cited (docs.snowflake.com/en/user-guide/intro-editions, read 2026-11-01): what
// each edition adds over the one before. Tinted: what this course uses, and the course that uses it.
const f = (id: string, title: string, used?: string): Item => ({ type: 'item', id, title, sub: used ? `used in ${used}` : undefined, tone: used ? 'serve' : undefined })

export const howEditions: SceneModel = {
  title: 'Editions: what each one adds',
  sub: 'Each edition has everything of the one before it. This course runs on Enterprise',
  nodes: [
    {
      type: 'group', id: 'ladder', bare: true, dir: 'row', children: [
    {
      type: 'group', id: 'standard', badge: 1, title: 'Standard', icon: 'snowflakedb', tone: 'neutral', children: [
        f('s-wh', 'Virtual warehouses', 'Course 2'), f('s-rm', 'Resource monitors', 'Course 3'),
        f('s-tt', 'Time Travel: 1 day', 'Course 12'), f('s-np', 'Network policies, SSO, OAuth', 'Course 4'),
      ],
    },
    {
      type: 'group', id: 'enterprise', badge: 2, title: 'Enterprise', sub: 'this course', icon: 'snowflakedb', tone: 'store', children: [
        f('e-mc', 'Multi-cluster warehouses', 'Course 10'), f('e-mv', 'Materialised views', 'Course 10'),
        f('e-so', 'Search optimisation', 'Course 10'), f('e-qa', 'Query acceleration', 'Course 10'),
        f('e-mask', 'Masking policies', 'Course 11'), f('e-row', 'Row access policies', 'Course 11'),
        f('e-tt', 'Time Travel: up to 90 days'), f('e-rekey', 'Periodic rekeying'),
      ],
    },
    {
      type: 'group', id: 'critical', badge: 3, title: 'Business Critical', icon: 'shield', tone: 'neutral', children: [
        f('b-tss', 'Tri-Secret Secure: your own key'), f('b-pl', 'Private connectivity'),
        f('b-fail', 'Failover and failback'), f('b-phi', 'HIPAA, HITRUST health data'),
      ],
    },
    {
      type: 'group', id: 'vps', badge: 4, title: 'Virtual Private Snowflake', icon: 'lock', tone: 'neutral', children: [
        f('v-own', 'Its own metadata and compute'), f('v-iso', 'No hardware shared'),
      ],
    },
      ],
    },
    { type: 'note', id: 'source', tone: 'neutral', text: 'Doc-cited, not run: docs.snowflake.com/en/user-guide/intro-editions. An edition changes the price of a credit, not how credits are counted.' },
  ],
  edges: [
    { from: 'standard', to: 'enterprise', label: '+' },
    { from: 'enterprise', to: 'critical', label: '+' },
    { from: 'critical', to: 'vps', label: '+' },
  ],
}
