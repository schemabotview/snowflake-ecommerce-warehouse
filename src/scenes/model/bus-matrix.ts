import type { SceneModel } from '@graphlearning/graphl-flow'

// §6.3 — The bus matrix: Shopwave's business processes × the dimensions they share. Doc-cited
// (Kimball & Ross, ch. 4, "the enterprise data warehouse bus matrix"); the rows are this course's
// facts (Courses 6–9), the columns its conformed dimensions.
const X = '●', _ = ''

export const modelBusMatrix: SceneModel = {
  title: 'The bus matrix: one set of dimensions, every process',
  sub: 'Each row a business process and its fact table; each column a dimension they all share',
  dir: 'row',
  nodes: [
    {
      type: 'group', id: 'matrix', badge: 1, title: 'Shopwave’s bus matrix', icon: 'table', tone: 'infra', children: [
        { type: 'table', id: 'bus', columns: ['process', 'fact table', 'course', 'date', 'customer', 'product', 'currency', 'campaign'], rows: [
          { cells: ['Sales', 'fct_order_lines', '6', X, X, X, X, _], tone: 'serve' },
          ['Order fulfilment', 'fct_order_lifecycle', '9', X, X, _, X, _],
          ['Returns', 'fct_returns', '9', X, X, X, X, _],
          ['Site visits', 'fct_sessions', '9', X, X, _, _, X],
          ['Checkout funnel', 'fct_funnel', '9', X, _, _, _, X],
          ['Customer month', 'fct_customer_monthly', '9', X, X, _, X, _],
          ['Campaign eligibility', 'fct_campaign_eligibility', '9', X, X, _, _, X],
        ] },
      ],
    },
    {
      type: 'group', id: 'why', badge: 2, title: 'Why it matters', tone: 'neutral', children: [
        { type: 'item', id: 'w-conformed', icon: 'layers', title: 'Conformed dimensions', sub: 'one dim_customer for every fact, not one each' },
        { type: 'item', id: 'w-drill', icon: 'search', title: 'Drill across', sub: 'sales and returns, by the same customer' },
        { type: 'item', id: 'w-plan', icon: 'workflow', title: 'A build plan', sub: 'one row at a time, dimensions reused' },
      ],
    },
  ],
  edges: [{ from: 'matrix', to: 'why' }],
}
