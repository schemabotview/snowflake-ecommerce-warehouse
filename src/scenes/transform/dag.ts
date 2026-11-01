import session from '../../../spine/transform/04-dag/session.txt?raw'

// The DAG as dbt itself built it: parsed out of 7.4's real `dbt parse` + `python dag.py` run
// (runs locally). Every model, its materialisation and its parents; nothing typed.
export interface DagNode { name: string; mat: string; parents: string[] }

export const DAG: DagNode[] = (() => {
  const out: DagNode[] = []
  const lines = session.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(\w+)\s+(table|view|ephemeral|incremental)\s+<-\s*(.*)$/)
    if (!m) continue
    let parents = m[3]
    while (lines[i + 1]?.startsWith(' '.repeat(31))) parents += ' ' + lines[++i].trim()
    out.push({ name: m[1], mat: m[2], parents: parents.split(',').map((p) => p.trim()).filter(Boolean) })
  }
  if (!out.length) throw new Error('dag.ts: no models in 7.4’s session')
  return out
})()

export const SOURCES = [...new Set(DAG.filter((n) => n.name.startsWith('stg_')).flatMap((n) => n.parents))]
export const node = (name: string) => DAG.find((n) => n.name === name)!
