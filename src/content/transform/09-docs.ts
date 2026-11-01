import type { Section } from '../types'

export const docs: Section = {
  id: 'docs',
  title: "Docs and lineage",
  scene: 'transform-docs',
  narration:
    "The last piece of a d b t project is its documentation, and d b t writes most of it itself. The terminal runs d b t docs generate. It reads the project, as parse did, and then asks Snowflake about every model it built, its columns, types and size. Look at the side pane's table: it writes a manifest of the project, a catalog of what Snowflake holds, and a small website that combines the two, with every model's description, columns and tests, searchable, and a lineage graph. That website is normally served with d b t docs serve and opened in a browser; this course draws the same information instead, from the files themselves. The editor shows a short script that reads the manifest and prints one model's lineage: the model, then everything it reads, then everything those read, back to the sources. The terminal's last command runs it for the fact table. The diagram at the top of the side pane draws that path, read from the manifest: the raw tables, the staging models that clean them, and the fact they feed, with the dimensions beside it. Lineage answers two questions people ask every week. Where does this number come from? Follow the arrows left. And if I change this model, what breaks? Follow them right. That completes the rebuild: the same star as course six, now built by d b t from raw in the right order, tested on every run, and documented. But the star still forgets the past: when a customer moves house, every old order moves with them.",
}
