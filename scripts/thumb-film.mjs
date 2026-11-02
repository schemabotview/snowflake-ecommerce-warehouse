#!/usr/bin/env node
// The YouTube thumbnail for the single full-course film (scripts/out/film.mp4).
//
// Ported from spark-ecommerce-analytics' thumb-film.mjs. Not the shell's `graphl-thumb`: that
// template is a PER-COURSE poster (58% scene + panel), and a cropped 16:9 video frame turns to mush
// at the ~168px the mobile feed actually renders. A film cover needs poster grammar — few elements,
// enormous type, one focal object.
//
// The card is REAL: the headline stat, every row and every box of the diagram are cut out of ONE
// spine session.txt, the same recorded output the scenes use, so the thumbnail cannot promise
// numbers the course does not produce. Anything the session does not hold is a hard error.

import { mkdirSync, readFileSync, existsSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join, dirname, isAbsolute } from 'node:path'
import { execFile } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

const run = promisify(execFile)
const repoDir = process.cwd()
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const FFMPEG = ['/opt/homebrew/bin/ffmpeg', '/usr/local/bin/ffmpeg'].find(existsSync) ?? 'ffmpeg'

const SCALE = 2
const W = 1280 * SCALE
const H = 720 * SCALE

// ── the real output ─────────────────────────────────────────────────────────────────────────────
const SESSIONS = {
  star:    join(repoDir, 'spine', 'model', '06-keys', 'session.txt'),
  revenue: join(repoDir, 'spine', 'serve', '01-revenue', 'session.txt'),
}
const readLines = (f) => readFileSync(f, 'utf8').split('\n').map((l) => l.trimEnd())

/** The psql-style result grid that follows a command: header names and data rows. */
function grid(lines, from) {
  const at = lines.findIndex((l, k) => k > from && /^\|.*\|$/.test(l))
  if (at < 0) return null
  const cells = (l) => l.slice(1, -1).split('|').map((c) => c.trim())
  const head = cells(lines[at])
  const rows = []
  for (let k = at + 2; k < lines.length && /^\|.*\|$/.test(lines[k]); k++) rows.push(cells(lines[k]))
  return { head, rows }
}

/**
 * The star, from the real keys query: the fact, each dimension it is LEFT JOINed to, the key it
 * joins on, and how many of the fact's rows found a match. One dimension per join — a join the
 * query does not make is not drawn.
 */
function realStar() {
  const lines = readLines(SESSIONS.star)
  const i = lines.findIndex((l) => /^\$ .*queries\/keys\.sql/.test(l))
  if (i < 0) throw new Error(`no keys.sql command in ${SESSIONS.star}`)
  const cmd = lines[i].replace(/^\$ /, '')
  const sql = []
  for (let k = i + 1; k < lines.length && !/^\+/.test(lines[k]); k++) sql.push(lines[k])

  const from = sql.join(' ').match(/FROM\s+(\w+)\s+AS\s+(\w+)/)
  if (!from) throw new Error('no FROM <fact> AS <alias> in keys.sql')
  const [, fact, fa] = from

  // `LEFT JOIN DIM_DATE AS d ON d.date_key = f.order_date_key`
  const joins = sql.flatMap((l) => {
    const m = l.match(/JOIN\s+(\w+)\s+AS\s+(\w+)\s+ON\s+\w+\.(\w+)\s*=\s*(\w+)\.(\w+)/)
    return m && m[4] === fa ? [{ dim: m[1], alias: m[2], pk: m[3], fk: m[5] }] : []
  })
  if (!joins.length) throw new Error('no dimension joins in keys.sql')

  // `COUNT(d.date_key) AS with_date` — which result column belongs to which dimension.
  const counts = Object.fromEntries(sql.flatMap((l) => {
    const m = l.match(/COUNT\((\w+)\.\w+\)\s+AS\s+(\w+)/)
    return m ? [[m[1], m[2].toUpperCase()]] : []
  }))
  const total = sql.join(' ').match(/COUNT\(\*\)\s+AS\s+(\w+)/)?.[1]?.toUpperCase()

  const g = grid(lines, i)
  if (!g || g.rows.length !== 1) throw new Error('keys.sql result is not one row')
  const val = (col) => {
    const k = g.head.indexOf(col)
    if (k < 0) throw new Error(`column ${col} not in the keys.sql result (have: ${g.head.join(', ')})`)
    return +g.rows[0][k]
  }
  const rows = val(total)
  const dims = joins.map((j) => {
    if (!counts[j.alias]) throw new Error(`no COUNT for ${j.dim} in keys.sql`)
    return { ...j, matched: val(counts[j.alias]) }
  })
  return { cmd, fact, rows, dims }
}

/** The real dbt run of the revenue mart, and the Black Friday week the same session queried. */
function realRevenue() {
  const lines = readLines(SESSIONS.revenue)
  const runLine = lines.find((l) => /^\$ dbt run /.test(l))
  if (!runLine) throw new Error(`no dbt run in ${SESSIONS.revenue}`)
  const cmd = runLine.replace(/^\$ /, '')
  const done = lines.find((l) => /Done\. PASS=/.test(l))
  if (!done) throw new Error('no dbt "Done. PASS=" line in the revenue session')
  const pass = done.match(/PASS=(\d+)/)[1]
  const error = done.match(/ERROR=(\d+)/)[1]

  const q = lines.findIndex((l) => /^\$ .*revenue\.sql/.test(l))
  const g = q >= 0 && grid(lines, q)
  if (!g) throw new Error('no revenue query result in the session')
  const di = g.head.indexOf('DATE'), ri = g.head.indexOf('REVENUE_EUR')
  if (di < 0 || ri < 0) throw new Error(`revenue result lacks DATE / REVENUE_EUR (have: ${g.head.join(', ')})`)
  const rows = g.rows.map((r) => ({ date: r[di], eur: r[ri] }))
  const top = Math.max(...rows.map((r) => +r.eur))
  return { cmd, pass, error, rows: rows.map((r) => ({ ...r, hot: +r.eur === top, pct: Math.round((+r.eur / top) * 100) })) }
}

const group = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const money = (s) => group(String(s).split('.')[0])
const day = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })

// ── the page ────────────────────────────────────────────────────────────────────────────────────
const fontFace = (fam, weight, file) => {
  const b64 = readFileSync(join(repoDir, 'node_modules', '@fontsource', fam, 'files', file)).toString('base64')
  return `@font-face{font-family:'${fam === 'ibm-plex-mono' ? 'IBM Plex Mono' : 'IBM Plex Sans'}';`
    + `font-weight:${weight};font-style:normal;font-display:block;`
    + `src:url(data:font/woff2;base64,${b64}) format('woff2')}`
}

// The scene engine's tone palette (@graphlearning/graphl-flow), copied from its dark table — the
// card is dark in every theme. The star takes the tones src/scenes/star.ts gives it: the fact
// `serve`, the dimensions `store`.
const TONE = {
  neutral: { accent: '#9aa4b2', tint: '#181b20' },
  ingest:  { accent: '#4f8ff7', tint: '#111d2e' },
  store:   { accent: '#37b877', tint: '#122419' },
  serve:   { accent: '#c98bff', tint: '#1e1428' },
  consume: { accent: '#f0656f', tint: '#2a1416' },
  infra:   { accent: '#f0902f', tint: '#241c12' },
}

// `accent` is the repo's --brand (#29b5e8, Snowflake blue) on the dark themes, a deeper blue on
// the light one, where the bright blue washes out.
const THEMES = {
  dark:  { badgeInk: '#071119', bg: '#0b1620', card: '#121c26', ink: '#ffffff', accent: '#29b5e8',
           rule: 'rgba(255,255,255,.13)', glow: 'radial-gradient(125% 115% at 10% 8%, #12364d 0%, #0b1620 62%)' },
  ice:   { badgeInk: '#071119', bg: '#08131c', card: '#0f1d29', ink: '#ffffff', accent: '#7fd3f2',
           rule: 'rgba(255,255,255,.12)', glow: 'radial-gradient(130% 110% at 86% 14%, #1b5a7c 0%, #08131c 60%)' },
  light: { badgeInk: '#ffffff', bg: '#f4f7fa', card: '#121c26', ink: '#0d1720', accent: '#1279a8',
           rule: 'rgba(0,0,0,.12)', glow: 'radial-gradient(120% 120% at 10% 8%, #ffffff 0%, #e3edf4 70%)' },
}

/**
 * The repo's own mark — NOT the Snowflake logo, and not a snowflake either. The logo is a
 * Snowflake Inc. trademark, and a six-armed crystal of our own would be the "confusingly similar"
 * derivative trademark policies forbid. The name is fine nominatively, in the title and narration.
 *
 * So the mark is what the course builds: a star schema — one fact, three dimensions — drawn
 * outlined, standing straight on the background, white on the dark themes, the accent on light.
 */
function markSvg(t, theme) {
  const ink = theme === 'light' ? t.accent : '#ffffff'
  const arm = [-90, 30, 150].map((deg) => {
    const a = (deg * Math.PI) / 180
    return { x: 32 + 22 * Math.cos(a), y: 32 + 22 * Math.sin(a), ix: 32 + 10 * Math.cos(a), iy: 32 + 10 * Math.sin(a),
             ox: 32 + 16 * Math.cos(a), oy: 32 + 16 * Math.sin(a) }
  })
  const s = 'fill="none" stroke="' + ink + '" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"'
  return `<svg class="logo" viewBox="0 0 64 64" role="img" aria-label="Star schema — GraphL"
    xmlns="http://www.w3.org/2000/svg">
    ${arm.map((p) => `<line x1="${p.ix.toFixed(2)}" y1="${p.iy.toFixed(2)}" x2="${p.ox.toFixed(2)}" y2="${p.oy.toFixed(2)}" ${s}/>`).join('')}
    <rect x="24" y="24" width="16" height="16" rx="3" ${s}/>
    ${arm.map((p) => `<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="6" ${s}/>`).join('')}
  </svg>`
}

/**
 * The canonical star — fact table in the middle, dimensions around it — drawn from THIS run: the
 * fact's name, each dimension the keys query joins, the key on each side of the join, and how many
 * of the fact's rows found their match. Edges run fact → dimension and never cross.
 */
function starSvg(s) {
  const VW = 900, VH = 540
  const mono = 'IBM Plex Mono, monospace'
  const sans = 'IBM Plex Sans, system-ui, sans-serif'
  const FACT = TONE.serve, DIM = TONE.store, INNER = TONE.neutral

  const label = (x, y, str, { size = 28, fill = '#ffffff', weight = 600, family = mono, anchor = 'start' } = {}) =>
    `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}"
       font-family="${family}" text-anchor="${anchor}">${esc(str)}</text>`
  const box = (x, y, w, h, tone, r = 16) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${tone.tint}"
       stroke="${tone.accent}" stroke-width="2.6"/>`
  const arrow = (x1, y1, x2, y2) => {
    const a = Math.atan2(y2 - y1, x2 - x1), h = 15
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INNER.accent}" stroke-width="3" opacity=".7"/>`
      + `<polygon points="${x2},${y2} ${(x2 - h * Math.cos(a - 0.42)).toFixed(1)},${(y2 - h * Math.sin(a - 0.42)).toFixed(1)} `
      + `${(x2 - h * Math.cos(a + 0.42)).toFixed(1)},${(y2 - h * Math.sin(a + 0.42)).toFixed(1)}" fill="${INNER.accent}"/>`
  }

  // The fact on the left, one key row per join; the dimensions stacked on the right, each beside
  // its key row, so every arrow is a short rightward line and none crosses another.
  const n = s.dims.length
  const DW = 390, DH = 156, GAP = (VH - n * DH) / Math.max(1, n - 1 || 1)
  const FX = 6, FW = 380, ROW = 74
  const FH = 112 + n * ROW + 18
  const FY = (VH - FH) / 2
  const DX = VW - DW - 6

  const fact = box(FX, FY, FW, FH, FACT)
    + label(FX + 22, FY + 48, s.fact.toLowerCase(), { size: 36, fill: FACT.accent, family: sans, weight: 700 })
    + label(FX + 22, FY + 88, `${group(s.rows)} rows`, { size: 28, weight: 400, fill: 'rgba(255,255,255,.6)' })
    + s.dims.map((d, k) => {
      const y = FY + 112 + k * ROW
      return box(FX + 18, y, FW - 36, ROW - 12, INNER, 10)
        + label(FX + 36, y + 41, d.fk, { size: 30 })
    }).join('')

  const dims = s.dims.map((d, k) => {
    const y = n === 1 ? (VH - DH) / 2 : k * (DH + GAP)
    const all = d.matched === s.rows
    return box(DX, y, DW, DH, DIM)
      + label(DX + 22, y + 48, d.dim.toLowerCase(), { size: 36, fill: DIM.accent, family: sans, weight: 700 })
      + label(DX + 22, y + 92, `key ${d.pk}`, { size: 27, weight: 400, fill: 'rgba(255,255,255,.7)' })
      + label(DX + 22, y + 134, `${group(d.matched)} matched`,
          { size: 29, fill: all ? DIM.accent : TONE.consume.accent })
  }).join('')

  const links = s.dims.map((d, k) => {
    const fy = FY + 112 + k * ROW + (ROW - 12) / 2
    const dy = (n === 1 ? (VH - DH) / 2 : k * (DH + GAP)) + DH / 2
    return arrow(FX + FW + 4, fy, DX - 6, dy)
  }).join('')

  return `<svg class="plot" viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg">${links}${fact}${dims}</svg>`
}

function pageHtml({ star, revenue, theme, head1, head2, badge }) {
  const t = THEMES[theme]
  const fonts = [
    fontFace('ibm-plex-sans', 700, 'ibm-plex-sans-latin-700-normal.woff2'),
    fontFace('ibm-plex-sans', 600, 'ibm-plex-sans-latin-600-normal.woff2'),
    fontFace('ibm-plex-mono', 600, 'ibm-plex-mono-latin-600-normal.woff2'),
    fontFace('ibm-plex-mono', 400, 'ibm-plex-mono-latin-400-normal.woff2'),
  ].join('')

  const cells = revenue ? revenue.rows.map((r) => {
    const col = r.hot ? t.accent : '#5f7a8c'
    return `<span class="day${r.hot ? ' hot' : ''}">${esc(day(r.date))}</span>`
      + `<span class="bar"><i style="width:${r.pct}%;background:${col}"></i></span>`
      + `<span class="eur"${r.hot ? ` style="color:${t.accent}"` : ''}>€${esc(money(r.eur))}</span>`
  }).join('') : ''
  const hot = revenue?.rows.find((r) => r.hot)

  return `<style>
  ${fonts}
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:${W}px;height:${H}px;overflow:hidden}
  body{background:${t.bg};background-image:${t.glow};
       font-family:'IBM Plex Sans',system-ui,sans-serif;color:${t.ink};
       display:flex;align-items:stretch;gap:${40 * SCALE}px;padding:${46 * SCALE}px ${50 * SCALE}px}

  .left{flex:0 0 auto;max-width:${520 * SCALE}px;display:flex;flex-direction:column;justify-content:center}
  .logo{width:${92 * SCALE}px;height:${92 * SCALE}px;display:block;margin-bottom:${18 * SCALE}px;align-self:flex-start}
  .h{font-weight:700;line-height:.85;letter-spacing:-.05em;font-size:${116 * SCALE}px;white-space:nowrap}
  .h2{color:${t.accent}}
  .badge{align-self:flex-start;margin-top:${26 * SCALE}px;padding:${11 * SCALE}px ${24 * SCALE}px;
         background:${t.accent};border-radius:${12 * SCALE}px;
         font-weight:700;font-size:${34 * SCALE}px;letter-spacing:.06em;color:${t.badgeInk}}

  .card{flex:1;min-width:0;background:${t.card};border:${1 * SCALE}px solid ${t.rule};
        border-radius:${18 * SCALE}px;padding:${26 * SCALE}px ${30 * SCALE}px ${24 * SCALE}px;
        display:flex;flex-direction:column;box-shadow:0 ${22 * SCALE}px ${64 * SCALE}px rgba(0,0,0,.5)}
  .dots{display:flex;gap:${9 * SCALE}px;margin-bottom:${16 * SCALE}px}
  .dots i{width:${13 * SCALE}px;height:${13 * SCALE}px;border-radius:50%}
  .cmd{font-family:'IBM Plex Mono',monospace;font-size:${25 * SCALE}px;color:rgba(255,255,255,.62);
       margin-bottom:${16 * SCALE}px;white-space:nowrap}
  .cmd b{color:#6ee787;font-weight:400}

  .stat{font-family:'IBM Plex Mono',monospace;font-weight:600;color:#fff;
        font-size:${40 * SCALE}px;letter-spacing:-.02em;white-space:nowrap}
  .stat em{font-style:normal;color:${theme === 'light' ? '#29b5e8' : t.accent}}
  .statsub{font-family:'IBM Plex Mono',monospace;font-size:${25 * SCALE}px;
           color:rgba(255,255,255,.55);margin-top:${6 * SCALE}px;white-space:nowrap}

  .rows{flex:1;display:grid;align-content:center;grid-template-columns:auto 1fr auto;
        column-gap:${16 * SCALE}px;row-gap:${12 * SCALE}px;
        font-family:'IBM Plex Mono',monospace;font-weight:600;font-size:${29 * SCALE}px;color:#fff}
  .day{letter-spacing:-.02em;color:rgba(255,255,255,.8)}
  .day.hot{color:${theme === 'light' ? '#29b5e8' : t.accent}}
  .bar{height:${20 * SCALE}px;min-width:${110 * SCALE}px;border-radius:${10 * SCALE}px;
       background:rgba(255,255,255,.1);overflow:hidden;align-self:center}
  .bar i{display:block;height:100%;border-radius:${10 * SCALE}px}
  .eur{text-align:right;white-space:nowrap;color:rgba(255,255,255,.9)}
  .foot{font-family:'IBM Plex Mono',monospace;font-size:${23 * SCALE}px;white-space:nowrap;
        color:rgba(255,255,255,.4);letter-spacing:.04em}
  .plotwrap{flex:1;min-height:0;display:flex;margin:${10 * SCALE}px 0 ${8 * SCALE}px}
  .plot{width:100%;height:100%;display:block;overflow:visible}
</style>
<div class="left">
  ${markSvg(t, theme)}
  <div class="h">${esc(head1)}</div>
  ${head2.split(/\s+/).map((w) => `<div class="h h2">${esc(w)}</div>`).join('')}
  <div class="badge">${esc(badge)}</div>
</div>
<div class="card">
  <div class="dots"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i></div>
  <div class="cmd">$ <b>${esc(star ? star.cmd : revenue.cmd)}</b></div>
  ${star
    ? `<div class="stat"><em>${esc(group(star.rows))}</em> order lines</div>
       <div class="statsub">${star.dims.length} dimensions · every row matched</div>
       <div class="plotwrap">${starSvg(star)}</div>
       <div class="foot">a real star schema · one fact, its dimensions</div>`
    : `<div class="stat">Black Friday <em>€${esc(money(hot.eur))}</em></div>
       <div class="statsub">dbt PASS=${esc(revenue.pass)} ERROR=${esc(revenue.error)} · revenue in EUR</div>
       <div class="rows">${cells}</div>
       <div class="foot">the Black Friday week · revenue per day</div>`}
</div>`
}

// ── render ──────────────────────────────────────────────────────────────────────────────────────
async function main() {
  const argv = process.argv.slice(2)
  const opt = { theme: 'dark', out: 'output/thumbnails/film.png', source: 'star',
                head1: 'LEARN', head2: 'SNOWFLAKE', badge: 'FULL COURSE' }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--theme') opt.theme = argv[++i]
    else if (a === '--out') opt.out = argv[++i]
    else if (a === '--head1') opt.head1 = argv[++i]
    else if (a === '--head2') opt.head2 = argv[++i]
    else if (a === '--badge') opt.badge = argv[++i]
    else if (a === '--source') opt.source = argv[++i]
    else { console.error(`unknown argument: ${a}`); process.exit(2) }
  }
  if (!THEMES[opt.theme]) { console.error(`unknown theme: ${opt.theme} (have: ${Object.keys(THEMES).join(', ')})`); process.exit(2) }
  if (!SESSIONS[opt.source]) { console.error(`unknown source: ${opt.source} (have: ${Object.keys(SESSIONS).join(', ')})`); process.exit(2) }

  const star = opt.source === 'star' ? realStar() : null
  const revenue = opt.source === 'revenue' ? realRevenue() : null
  if (star) {
    if (star.dims.some((d) => d.matched !== star.rows)) {
      throw new Error('a dimension did not match every fact row — the card says "every row matched"')
    }
    console.log(`Real star from spine: $ ${star.cmd}`)
    console.log(`  ${star.fact}: ${star.rows} rows`)
    for (const d of star.dims) console.log(`  ${star.fact}.${d.fk} → ${d.dim}.${d.pk}: ${d.matched} matched`)
  } else {
    console.log(`Real revenue from spine: $ ${revenue.cmd}  (PASS=${revenue.pass} ERROR=${revenue.error})`)
    for (const r of revenue.rows) console.log(`  ${r.date}  €${r.eur}  (${r.pct}%)${r.hot ? '  ← hero' : ''}`)
  }

  const requireFromRepo = createRequire(join(repoDir, 'package.json'))
  const { default: puppeteer } = await import(pathToFileURL(requireFromRepo.resolve('puppeteer')).href)

  const browser = await puppeteer.launch({ headless: true,
    defaultViewport: { width: W, height: H, deviceScaleFactor: 1 }, args: [`--window-size=${W},${H}`] })
  try {
    const page = await browser.newPage()
    await page.setContent(pageHtml({ star, revenue, ...opt }), { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    // The real command must appear in full — never truncated — so fit it by shrinking, not cutting.
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('.h,.cmd,.stat,.statsub,.foot')) {
        const room = el.clientWidth - 1
        if (el.scrollWidth <= room) continue
        const px = parseFloat(getComputedStyle(el).fontSize)
        el.style.fontSize = `${Math.max(10, Math.floor(px * (room / el.scrollWidth) * 0.98))}px`
      }
    })
    await sleep(250)

    // A thumbnail that silently clips its own text is worse than one that fails loudly.
    const overflow = await page.evaluate(() => {
      const bad = []
      for (const sel of ['.rows', '.card', '.left', 'body']) {
        const el = document.querySelector(sel)
        if (el && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1)) {
          bad.push(`${sel} ${el.scrollWidth}x${el.scrollHeight} > ${el.clientWidth}x${el.clientHeight}`)
        }
      }
      for (const el of document.querySelectorAll('.day,.eur,.cmd,.h,.badge,.stat,.statsub')) {
        const r = el.getBoundingClientRect()
        if (r.right > window.innerWidth + 1 || r.bottom > window.innerHeight + 1) {
          bad.push(`clipped: "${el.textContent.trim().slice(0, 20)}" right=${Math.round(r.right)}`)
        }
      }
      return bad
    })
    if (overflow.length) throw new Error(`layout overflows:\n  ${overflow.join('\n  ')}`)

    const out = isAbsolute(opt.out) ? opt.out : join(repoDir, opt.out)
    mkdirSync(dirname(out), { recursive: true })
    const big = join(tmpdir(), `thumb-film-${Date.now()}.png`)
    await page.screenshot({ path: big })
    await run(FFMPEG, ['-y', '-loglevel', 'error', '-i', big, '-vf', 'scale=1280:720:flags=lanczos', out])
    rmSync(big, { force: true })
    console.log(`\n✅ ${out}  (${opt.theme})`)
  } finally {
    await browser.close()
  }
}

main().catch((e) => { console.error('\n✗', e.message); process.exit(1) })
