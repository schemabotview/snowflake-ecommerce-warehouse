import type { SceneModel } from '@graphlearning/graphl-flow'

// §7.1 — ELT layers. Concept, doc-cited: dbt's own guide to project structure
// (docs.getdbt.com/best-practices/how-we-structure/1-guide-overview). Nothing is run.
export const transformElt: SceneModel = {
  title: 'ELT: load first, transform inside the warehouse',
  sub: 'Three layers, each built only from the one before it',
  nodes: [
    {
      type: 'group', id: 'layers', bare: true, dir: 'row', children: [
        {
          type: 'group', id: 'l-raw', badge: 1, title: 'RAW', sub: 'Course 5: loaded, never edited', icon: 'database', tone: 'ingest', children: [
            { type: 'item', id: 'r-what', icon: 'package', title: 'Every source, as sent', sub: 'files’ own names, types, quirks' },
            { type: 'item', id: 'r-who', icon: 'users', title: 'LOADER writes it', sub: 'nobody else may' },
          ],
        },
        {
          type: 'group', id: 'l-staging', badge: 2, title: 'STAGING', sub: 'one view per source table', icon: 'filter', tone: 'store', children: [
            { type: 'item', id: 's-what', icon: 'workflow', title: 'Rename, cast, clean', sub: 'dedupe, one name for one thing' },
            { type: 'item', id: 's-rule', icon: 'lock', title: 'No joins, no business logic', sub: 'a clean copy of the source' },
          ],
        },
        {
          type: 'group', id: 'l-marts', badge: 3, title: 'MARTS', sub: 'the dimensional model', icon: 'layers', tone: 'serve', children: [
            { type: 'item', id: 'm-what', icon: 'table', title: 'Facts and dimensions', sub: 'joined, keyed, tested' },
            { type: 'item', id: 'm-who', icon: 'chart', title: 'ANALYST reads it', sub: 'and BI, built on it (Course 11)' },
          ],
        },
      ],
    },
    {
      type: 'group', id: 'vs', title: 'ETL vs ELT', icon: 'zap', tone: 'neutral', dir: 'row', children: [
        { type: 'item', id: 'etl', icon: 'server', title: 'ETL: transform, then load', sub: 'a separate server; raw data never reaches the warehouse' },
        { type: 'item', id: 'elt', icon: 'snowflakedb', title: 'ELT: load, then transform', sub: 'in SQL, on the warehouse’s compute; raw kept, rebuild any time', tone: 'serve' },
      ],
    },
  ],
  edges: [
    { from: 'l-raw', to: 'l-staging', label: 'source()' },
    { from: 'l-staging', to: 'l-marts', label: 'ref()' },
  ],
}
