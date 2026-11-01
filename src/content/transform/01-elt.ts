import type { Section } from '../types'

export const elt: Section = {
  id: 'elt',
  title: "ELT layers",
  scene: 'transform-elt',
  narration:
    "The star from the last course works, but it was built by hand: a handful of scripts, run in the right order by a person who remembers the order. This course rebuilds it with d b t, a tool that turns S Q L files into a tested, repeatable build, and first, the shape that build takes. This frame is a concept, drawn from d b t's own guide to structuring a project; nothing is run. The warehouse has three layers, each built only from the one before. Raw is what course five loaded: every source exactly as it was sent, written only by the loader. Staging is one view per source table, and it does three things only: renames columns, casts types, and cleans what must be cleaned, like duplicates. It never joins two sources and never holds a business rule; it is a clean copy of the source. Marts hold the dimensional model: facts and dimensions, joined, keyed and tested, which is what the analyst role reads. The arrows between the layers are the two functions d b t gives you: source, to read raw, and ref, to read another model. The bottom of the frame names the idea behind all of it. The older way, E T L, transformed data on a separate server before loading it, so the warehouse never saw the raw data. E L T loads first and transforms inside the warehouse, in S Q L, on the warehouse's own compute: raw is always there, and any layer can be rebuilt from it. Next, a d b t project, and how it reaches Snowflake.",
}
