import { trim } from './ide'

// Snowflake steps are recorded ONCE (scripts/spine.py --record). Until then a step's session.txt
// holds only the typed `$ ` commands, and a scene renders with them: the terminal shows what will be
// run, and every value the scene reads from the run shows PENDING. Once recorded, a value that cannot
// be found THROWS — check-render reports it as a page error naming the scene — so a scene can never
// silently show a placeholder for a step that has really run.

export const PENDING = '…'

/** Whether the step's transcript holds output yet. */
export const isRecorded = (session: string) => trim(session).split('\n').some((l) => l.trim() && !l.startsWith('$ '))

/** Group 1 of `re` in the run's output; PENDING before the step is recorded. */
export function fromRun(session: string, re: RegExp, what = re.source): string {
  if (!isRecorded(session)) return PENDING
  const m = session.match(re)
  if (!m) throw new Error(`recorded.ts: ${what} is not in the recorded session`)
  return m[1]
}

/**
 * A cell of a result table as the Snowflake CLI (or psql) prints it: the first table whose header
 * row names `column` (case-blind), `row` rows down (0 = the first data row), after the `after`-th
 * such table. Box-drawing (│ ┃ |) and rule rows (─ ━ - +) are understood; PENDING before recording.
 */
export function cell(session: string, column: string, row = 0, after = 0): string {
  if (!isRecorded(session)) return PENDING
  const lines = session.split('\n')
  const split = splitRow
  let seen = 0
  for (let i = 0; i < lines.length; i++) {
    const cells = split(lines[i])
    const at = cells.findIndex((c) => c.toUpperCase() === column.toUpperCase())
    if (at < 0) continue
    if (seen++ < after) continue
    const data = lines.slice(i + 1).filter((l) => split(l).length === cells.length && !/^[\s─━\-+┼╪╋├┤┡┩│┃|]*$/.test(l))
    if (data[row] === undefined) break
    return split(data[row])[at]
  }
  throw new Error(`recorded.ts: no ${column} (row ${row}) in the recorded session`)
}

/**
 * Every data row of the first result table whose header names `column` (after the `after`-th such
 * table), as cells. Before recording: one row of PENDING cells, `width` wide, so a scene's table keeps
 * its shape (`pending` rows of them: how many the step is expected to return).
 */
export function rowsOf(session: string, column: string, width: number, after = 0, pending = 1): string[][] {
  if (!isRecorded(session)) return Array.from({ length: pending }, () => Array(width).fill(PENDING))
  const out: string[][] = []
  for (let r = 0; ; r++) {
    try {
      out.push(Array.from({ length: width }, (_, c) => cellAt(session, column, r, c, after)))
    } catch {
      break
    }
  }
  if (!out.length) throw new Error(`recorded.ts: no rows under ${column} in the recorded session`)
  return out
}

/** Column `col` (0-based, counted from the header column named `column`) of data row `row`. */
function cellAt(session: string, column: string, row: number, col: number, after: number): string {
  const lines = session.split('\n')
  const split = splitRow
  let seen = 0
  for (let i = 0; i < lines.length; i++) {
    const cells = split(lines[i])
    const at = cells.findIndex((c) => c.toUpperCase() === column.toUpperCase())
    if (at < 0 || seen++ < after) continue
    const data = []
    for (const l of lines.slice(i + 1)) {
      if (/^[\s─━\-+┼╪╋├┤┡┩└┘┴┌┐┬╭╮╰╯═╞╡╤╧]*$/.test(l) && l.trim()) continue  // a rule row
      if (l.startsWith('$ ') || (!/[│┃|]/.test(l) && l.trim())) break
      if (split(l).length === cells.length && !/^[\s─━\-+┼╪╋├┤┡┩└┘┴│┃|]*$/.test(l)) data.push(l)
    }
    if (data[row] === undefined || split(data[row])[at + col] === undefined) break
    return split(data[row])[at + col]
  }
  throw new Error('no such cell')
}

/** A result row's cells: the Snowflake CLI draws an outer border (│ a │ b │), psql does not
 *  ( a | b ). A line with no column rule has no cells. */
function splitRow(l: string): string[] {
  if (!/[│┃|]/.test(l)) return []
  const parts = l.split(/[│┃|]/)
  if (/^\s*[│┃|]/.test(l)) parts.shift()
  if (/[│┃|]\s*$/.test(l)) parts.pop()
  return parts.map((c) => c.trim())
}
