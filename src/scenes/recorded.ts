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
  const split = (l: string) => l.split(/[│┃|]/).slice(1, -1).map((c) => c.trim())
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
