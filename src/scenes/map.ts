import type { Edge, Group, Item, SceneModel, SceneNode } from '@graphlearning/graphl-flow'

// THE WAREHOUSE'S MAP — `shopwave-dw`'s whole final shape (COURSE-PLAN.md, "Frames"): Shopwave's
// sources on the left; the Snowflake account in the middle, its data flowing RAW → STAGING → the star
// → marts → BI, beside the compute, the access and the operations that run it; the readers on the
// right: BI and finance, and Brightline through a share.
//
// It is the WHOLE warehouse from its first appearance (Course 1) to the end. A part not built yet is
// drawn — same size, same place — greyed (graphl-flow's `muted`), so the map never moves, a viewer
// always knows where a part will be, and a section shows what it adds by colour and by its `focus`
// ring, never by layout. check-render asserts every map frame lands on one fit (aws-ecommerce's).
//
// `BUILT[course]` is what exists at the END of that course — never rename a part: section focus and
// later scenes name these ids.

interface Part { id: string; icon: string; title: string; sub?: string }
const p = (id: string, icon: string, title: string, sub?: string): Part => ({ id, icon, title, sub })

const SOURCES = [
  p('src-shop', 'postgresql', 'Shop database', 'orders, items, customers'),
  p('src-pay', 'card', 'Payment provider', 'Parquet, daily'),
  p('src-clicks', 'globe', 'Site tracker', 'JSON clicks'),
  p('src-returns', 'package', 'Returns', 'Latin-1 CSV, monthly'),
  p('src-fx', 'chart', 'FX rates', 'four currencies'),
]
// The data path, left to right inside the account: each layer is one database or schema.
const LAYERS: [string, string, string, Part[]][] = [
  ['raw', 'RAW', 'as loaded, never edited', [p('landing', 'disk', 'Stage LANDING', 'files in'), p('raw-tables', 'table', 'RAW.SHOPWAVE', 'one table per source'), p('pipe', 'stream', 'Snowpipe', 'continuous load')]],
  ['staging', 'STAGING', 'cleaned, renamed, typed', [p('stg', 'filter', 'stg_* models', 'one per source'), p('snapshots', 'clock', 'Snapshots', 'customers, prices: SCD2')]],
  ['marts', 'MARTS', 'the dimensional model', [p('star', 'layers', 'The star', 'fct_order_lines + dims'), p('facts', 'table', 'More facts', 'lifecycle, returns, funnel')]],
  ['bi', 'BI', 'one definition of revenue', [p('mart-revenue', 'pie', 'mart_revenue', 'by day, by category'), p('metrics', 'gauge', 'Metrics', 'revenue, AOV, cohorts')]],
]
const AROUND: [string, string, Part[]][] = [
  ['compute', 'Compute', [p('wh-load', 'cpu', 'WH_LOAD', 'XS'), p('wh-transform', 'cpu', 'WH_TRANSFORM', 'XS'), p('wh-bi', 'cpu', 'WH_BI', 'XS, 1–3 clusters'), p('monitor', 'gauge', 'RM_MONTHLY', '50 credits')]],
  ['access', 'Access', [p('roles', 'users', 'Roles', 'loader, transformer, analyst'), p('keys', 'key', 'Key pairs', 'svc_loader, svc_dbt'), p('policies', 'shield', 'Policies', 'masking, row access')]],
  ['ops', 'Operations', [p('dbt', 'workflow', 'dbt', 'models, tests, docs'), p('tasks', 'timer', 'Tasks', 'every night'), p('clone', 'branch', 'ANALYTICS_DEV', 'a zero-copy clone'), p('ci', 'githubactions', 'CI', 'a PR builds on a clone')]],
]
const READERS = [
  p('dashboard', 'chart', 'Dashboard', 'BI and finance'),
  p('analysts', 'users', 'Analysts', 'ad hoc SQL'),
  p('share', 'building', 'Brightline', 'a secure share, no copy'),
]

const ALL = [...SOURCES, ...LAYERS.flatMap(([, , , ps]) => ps), ...AROUND.flatMap(([, , ps]) => ps), ...READERS].map((x) => x.id)

/** What the warehouse has at the end of each course (cumulative). */
export const BUILT: Record<string, string[]> = { intro: [] }
BUILT['how-snowflake-runs'] = ['wh-load']
BUILT.start = [...BUILT['how-snowflake-runs'], 'src-shop', 'raw-tables', 'monitor']
BUILT.secure = [...BUILT.start, 'roles', 'keys', 'wh-bi']
BUILT.load = [...BUILT.secure, 'src-pay', 'src-clicks', 'src-returns', 'src-fx', 'landing', 'pipe']
BUILT.model = [...BUILT.load, 'star', 'analysts']
BUILT.transform = [...BUILT.model, 'wh-transform', 'stg', 'dbt']
BUILT.history = [...BUILT.transform, 'snapshots']
BUILT.facts = [...BUILT.history, 'facts']
BUILT.perform = [...BUILT.facts]
BUILT.serve = [...BUILT.perform, 'mart-revenue', 'metrics', 'policies', 'dashboard', 'share']
BUILT.operate = [...BUILT.serve, 'tasks', 'clone', 'ci']
/** Every part: the finished warehouse (Course 1's "what we'll build"). */
export const EVERYTHING = ALL

function item(part: Part, built: boolean): Item {
  return { type: 'item', id: part.id, title: part.title, sub: part.sub, icon: part.icon, muted: !built || undefined }
}

/** The map, given what exists. A group whose parts are all still to come is drawn muted too. */
export function warehouseMap(built: string[]): SceneNode {
  const has = (id: string) => built.includes(id)
  const it = (part: Part) => item(part, has(part.id))
  const group = (id: string, title: string, sub: string | undefined, parts: Part[], extra: Partial<Group> = {}): Group => (
    { type: 'group', id, title, sub, children: parts.map(it), muted: !parts.some((x) => has(x.id)) || undefined, ...extra })
  const sources = group('sources', 'Shopwave’s sources', undefined, SOURCES, { icon: 'database', tone: 'source' })
  const flow: Group = {
    type: 'group', id: 'flow', bare: true, dir: 'row',
    children: LAYERS.map(([id, title, sub, parts]) => group(id, title, sub, parts, { tone: id === 'raw' ? 'ingest' : id === 'bi' ? 'serve' : 'store' })),
  }
  const around: Group = {
    type: 'group', id: 'around', bare: true, dir: 'row',
    children: AROUND.map(([id, title, parts]) => group(id, title, undefined, parts, { tone: 'infra', dir: 'grid', cols: 2 })),
  }
  const account: Group = {
    type: 'group', id: 'account', icon: 'snowflakedb', title: 'Snowflake account shopwave-dw', sub: 'Enterprise · AWS eu-west-2 (London)', dashed: true,
    children: [flow, around],
  }
  const readers = group('readers', 'Who reads it', undefined, READERS, { icon: 'users', tone: 'consume' })
  return { type: 'group', id: 'map', bare: true, dir: 'row', children: [sources, account, readers] }
}

/** The data path, always drawn: an arrow to a part not built yet is still where data will flow. */
export const MAP_EDGES: Edge[] = [
  { from: 'sources', to: 'raw', label: 'load' },
  { from: 'raw', to: 'staging' },
  { from: 'staging', to: 'marts' },
  { from: 'marts', to: 'bi' },
  { from: 'bi', to: 'readers', label: 'serve' },
]

/** A full-frame map. */
export function mapScene(built: string[], extra: Partial<SceneModel> = {}): SceneModel {
  return { nodes: [warehouseMap(built)], edges: MAP_EDGES, ...extra }
}

// ── the map frame ─────────────────────────────────────────────────────────────────────────────────
//
//   the map (MAP_W × MAP_H, fixed)
//   ───────────────────────────────
//   side strip (MAP_W × SIDE_H, fixed): what the section adds — a terminal, a diagram
//
// The map is wide and flat (measured 1899 × 510 natural on graphl-flow 0.8), so its frame stacks the
// side pane UNDER it rather than beside it (aws-ecommerce's map was tall, so its side pane was on the
// right). Both boxes are FIXED, width and height, so every map frame has the same natural box, the
// same fit (check-render asserts it) and the map's parts at the same pixels in every course. The
// strip's height is what a 16:9 frame leaves: MAP_W / SCENE_ASPECT − MAP_H − the gap.

export const MAP_W = 1900
export const MAP_H = 510
export const SIDE_H = Math.round(MAP_W / (16 / 9)) - MAP_H - 10

export interface MapFrame {
  /** What exists before or during this section (BUILT of the previous course, plus this course's so far). */
  built: string[]
  /** The strip under the map: a terminal, then a small diagram, side by side. */
  side: SceneNode[]
  /** Edges inside the strip. */
  edges?: Edge[]
}

export function mapFrame({ built, side, edges = [] }: MapFrame): SceneModel {
  return {
    nodes: [
      { type: 'group', id: 'map-pane', bare: true, w: MAP_W, h: MAP_H, children: [warehouseMap(built)] },
      { type: 'group', id: 'map-side', bare: true, dir: 'row', w: MAP_W, h: SIDE_H, children: side },
    ],
    edges: [...MAP_EDGES, ...edges],
  }
}
