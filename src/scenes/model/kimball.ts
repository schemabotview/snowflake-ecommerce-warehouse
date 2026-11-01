import type { SceneModel } from '@graphlearning/graphl-flow'

// §6.1 — Kimball's four steps. Doc-cited: Kimball & Ross, The Data Warehouse Toolkit, 3rd ed. (Wiley,
// 2013), ch. 2–3, "the four-step dimensional design process". Applied to Shopwave: nothing is run.
const step = (id: string, badge: number, title: string, sub: string, ask: string, answer: string, more: string, tone: 'source' | 'ingest' | 'store' | 'serve') => ({
  type: 'group' as const, id, badge, title, sub, tone, children: [
    { type: 'item' as const, id: `${id}-q`, icon: 'search', title: ask, sub: 'the question' },
    { type: 'item' as const, id: `${id}-a`, icon: 'check', title: answer, sub: more },
  ],
})

export const modelKimball: SceneModel = {
  title: 'Dimensional modelling in four steps',
  sub: 'Kimball and Ross’s design process, applied to Shopwave’s sales',
  nodes: [
    {
      type: 'group', id: 'steps', bare: true, dir: 'row', children: [
        step('s1', 1, 'Business process', 'what happens', 'What does the business do?', 'Selling: customers order products', 'one event per order line', 'source'),
        step('s2', 2, 'Grain', 'what one row means', 'What is one row?', 'One order line', 'the most detailed fact there is', 'ingest'),
        step('s3', 3, 'Dimensions', 'how it is described', 'By what do people slice it?', 'Date, customer, product, currency', 'who, what, when, in what money', 'store'),
        step('s4', 4, 'Facts', 'what is measured', 'What is counted or summed?', 'qty, unit_price, amount_eur', 'numbers true at that grain', 'serve'),
      ],
    },
    { type: 'note', id: 'source', tone: 'neutral', text: 'Doc-cited: Kimball & Ross, The Data Warehouse Toolkit, 3rd edition (2013), chapters 2–3. The order matters: the grain is chosen before any dimension or fact, and everything must be true at it.' },
  ],
  edges: [
    { from: 's1', to: 's2' },
    { from: 's2', to: 's3' },
    { from: 's3', to: 's4' },
  ],
}
