import type { Edge, Group, Table, TableRow } from '@graphlearning/graphl-flow'

// THE STAR — Shopwave's dimensional model, drawn the same way in every section from Course 6 on
// (COURSE-PLAN.md, "Frames"): the fact in the middle, its dimensions either side, an edge for every
// key. It is a side-pane diagram (it fits the IDE frame's 649px column), so a section shows the code
// that builds a part beside the part it builds.
//
// `stage` is how far the model has come: 'natural' (6.4–6.5: the fact joins on the shop's own ids),
// 'keys' (6.6: surrogate keys), 'roles' (6.8: a second date key). A dimension not built yet keeps its
// place, drawn neutral with the course that builds it. Never rename a table or a row: edges, focus
// and later scenes name them (`fact.customer_key`, `dim-date.date_key`).

export type StarStage = 'natural' | 'keys' | 'roles'
export type Dim = 'date' | 'customer' | 'product' | 'currency'

const row = (id: string, tag?: string, tone?: TableRow['tone']): TableRow => ({ id, cells: [id], tag, tone })

function factRows(stage: StarStage): TableRow[] {
  const keys = stage === 'natural'
    ? [row('order_date', 'FK'), row('customer_id', 'FK'), row('product_id', 'FK')]
    : [row('order_date_key', 'FK'), ...(stage === 'roles' ? [row('paid_date_key', 'FK')] : []), row('customer_key', 'FK'), row('product_key', 'FK')]
  return [row('order_id', 'DD'), row('line'), ...keys, row('order_status'), row('qty', '+'), row('unit_price'), row('amount_eur', '+')]
}

const DIMS: Record<Dim, (stage: StarStage) => TableRow[]> = {
  date: (s) => [row(s === 'natural' ? 'date' : 'date_key', 'PK'), row(s === 'natural' ? 'date_key' : 'date'), row('month'), row('is_weekend')],
  customer: (s) => s === 'natural' ? [row('customer_id', 'PK'), row('country'), row('signup_date')] : [row('customer_key', 'PK'), row('customer_id'), row('country')],
  product: (s) => s === 'natural' ? [row('product_id', 'PK'), row('category'), row('brand')] : [row('product_key', 'PK'), row('product_id'), row('category')],
  currency: () => [row('currency_key', 'PK'), row('code'), row('per_eur')],
}
const LATER: Partial<Record<Dim, string>> = { currency: 'Course 8' }

export interface StarOptions {
  stage: StarStage
  /** Dimensions that exist (the fact always does once the star is drawn). */
  dims: Dim[]
  /** Rows to tint in the fact: the ones a section is about. */
  lit?: string[]
}

/** The star as a side-pane group, and its edges. */
export function star({ stage, dims, lit = [] }: StarOptions): { node: Group; edges: Edge[] } {
  const table = (d: Dim): Table => {
    const built = dims.includes(d)
    return { type: 'table', id: `dim-${d}`, title: built ? `dim_${d}` : `dim_${d} · ${LATER[d] ?? 'next'}`, tone: built ? 'store' : 'neutral', rows: DIMS[d](stage) }
  }
  const fact: Table = {
    type: 'table', id: 'fact', title: 'fct_order_lines', tone: 'serve',
    rows: factRows(stage).map((r) => (lit.includes(r.id!) ? { ...r, tone: 'serve' as const } : r)),
  }
  const node: Group = {
    type: 'group', id: 'star', title: 'The star', sub: 'grain: one row per order line', icon: 'layers', tone: 'neutral', dir: 'row', children: [
      { type: 'group', id: 'star-left', bare: true, children: [table('date'), table('customer')] },
      fact,
      { type: 'group', id: 'star-right', bare: true, children: [table('product'), table('currency')] },
    ],
  }
  const pairs: [string, string, Dim][] = stage === 'natural'
    ? [['order_date', 'date', 'date'], ['customer_id', 'customer_id', 'customer'], ['product_id', 'product_id', 'product']]
    : [['order_date_key', 'date_key', 'date'], ['customer_key', 'customer_key', 'customer'], ['product_key', 'product_key', 'product']]
  const edges: Edge[] = pairs.filter(([, , d]) => dims.includes(d)).map(([f, k, d]) => ({ from: `fact.${f}`, to: `dim-${d}.${k}` }))
  if (stage === 'roles' && dims.includes('date')) edges.push({ from: 'fact.paid_date_key', to: 'dim-date', dashed: true })
  return { node, edges }
}
