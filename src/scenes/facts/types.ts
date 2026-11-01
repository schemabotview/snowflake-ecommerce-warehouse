import type { SceneModel, Table } from '@graphlearning/graphl-flow'

// §9.1 — ◆ The three fact types. Doc-cited: Kimball & Ross, The Data Warehouse Toolkit, 3rd ed.
// (Wiley, 2013), ch. 4, "fact table types", and ch. 3 for the factless fact (promotion coverage).
// The sketches' values are the runs' own (9.2's orders 18000 and 20020, 9.6's customer 81).
// Each is drawn on the Shopwave table this course (or Course 6) builds; nothing is run here.
const sketch = (id: string, columns: string[], rows: string[][], tone: Table['tone']): Table => ({ type: 'table', id, columns, rows, tone })
const kind = (id: string, badge: number, title: string, sub: string, grain: string, grows: string, updated: string, table: Table, tone: Table['tone'], updIcon = 'lock') => ({
  type: 'group' as const, id, badge, title, sub, tone, children: [
    { type: 'item' as const, id: `${id}-grain`, icon: 'layers', title: grain, sub: 'one row is' },
    { type: 'item' as const, id: `${id}-grows`, icon: 'clock', title: grows, sub: 'rows are added' },
    { type: 'item' as const, id: `${id}-upd`, icon: updIcon, title: updated, sub: 'once written' },
    table,
  ],
})

export const factsTypes: SceneModel = {
  title: 'Three kinds of fact table',
  sub: 'Each answers a different question about the same shop',
  nodes: [
    {
      type: 'group', id: 'kinds', bare: true, dir: 'row', children: [
        kind('tx', 1, 'Transaction', 'fct_order_lines (Course 6)', 'One event: an order line', 'when an event happens', 'never changed',
          sketch('tx-t', ['order', 'line', 'event'], [['18000', '1', 'sold'], ['18001', '1', 'sold'], ['18002', '1', 'sold']], 'store'), 'store'),
        kind('ps', 2, 'Periodic snapshot', 'fct_customer_monthly (9.6)', 'A customer in a month', 'every period, for everyone', 'never changed',
          sketch('ps-t', ['month', 'customer', 'orders'], [['2026-01', '81', '2'], ['2026-02', '81', '2'], ['2026-03', '81', '2']], 'infra'), 'infra'),
        kind('acc', 3, 'Accumulating snapshot', 'fct_order_lifecycle (9.2)', 'One order, start to end', 'when an order is placed', 'each milestone fills in',
          sketch('acc-t', ['order', 'paid', 'shipped', 'delivered'], [['18000', '12-01', '12-02', '12-03'], ['20020', '12-31', '—', '—']], 'serve'), 'serve', 'workflow'),
      ],
    },
    {
      type: 'group', id: 'more', bare: true, dir: 'row', children: [
        { type: 'note', id: 'ask', tone: 'neutral', text: 'Transaction: what happened? Periodic snapshot: how did things stand at each period’s end? Accumulating snapshot: how far has each order got, and how long did each step take?' },
        { type: 'note', id: 'factless', tone: 'consume', text: 'A fourth shape has no measure at all: a factless fact, whose row is the fact (who could have used a campaign, 9.8).' },
      ],
    },
    { type: 'note', id: 'source', tone: 'neutral', text: 'Doc-cited: Kimball & Ross, The Data Warehouse Toolkit, 3rd edition (2013), chapter 4 (the three fact table types) and chapter 3 (factless facts). Nothing is run here.' },
  ],
  edges: [],
}
