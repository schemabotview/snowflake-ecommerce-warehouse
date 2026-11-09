import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { rowsOf } from '../recorded'
import { loadTree } from './tree'
import session from '../../../spine/load/01-stage/session.txt?raw'
import code from '../../../spine/load/01-stage/project/load/upload.sh?raw'

// §5.1 — Stages: every source file PUT to RAW.SHOPWAVE.LANDING by the loader (recorded on Snowflake).
const landed = rowsOf(session, 'SOURCE', 3, 0, 11)

export const loadStage: SceneModel = ideFrame2({
  model: 'TODO',
  tree: loadTree('queries/landing.sql', 'load/upload.sh', ['load/as-loader.sh', 'setup/stage.sql', 'load/upload.sh', 'queries/landing.sql']),
  editor: { file: 'load/upload.sh', code, lang: 'shell' },
  session,
  keep: ['$ bash load/as-loader.sh -f setup/stage.sql', 'Stage area LANDING successfully created', '$ bash load/upload.sh', 'uploaded:', '$ bash load/as-loader.sh -f queries/landing.sql', '| 10091'],
  side: [
    {
      type: 'group', id: 'path', badge: 1, title: 'A file’s way in', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 's-local', icon: 'folder', title: 'data/raw', sub: 'this machine', stack: true },
        { type: 'item', id: 's-stage', icon: 'disk', title: '@LANDING', sub: 'an internal stage', stack: true },
        { type: 'item', id: 's-table', icon: 'table', title: 'tables', sub: 'COPY: next', stack: true, muted: true },
      ],
    },
    {
      type: 'group', id: 'landed', badge: 2, title: 'What landed, by source', sub: 'the stage’s directory table, from the run', tone: 'neutral', children: [
        { type: 'table', id: 'sources', columns: ['source', 'files', 'MB'], rows: landed },
      ],
    },
    {
      type: 'group', id: 'kinds', badge: 3, title: 'Four kinds of stage', tone: 'infra', children: [
        { type: 'table', id: 'stages', columns: ['stage', 'where the files are', 'here'], rows: [
          { cells: ['@LANDING', 'named, internal: Snowflake keeps them', 'Course 5'], tone: 'serve' },
          ['@%PRODUCTS', 'a table’s own stage', 'Course 3'],
          ['@~', 'each user’s own stage', '—'],
          ['external', 'a bucket in S3, GCS or Azure', 'doc-cited'],
        ] },
      ],
    },
  ],
  edges: [
    { from: 's-local', to: 's-stage', label: 'PUT' },
    { from: 's-stage', to: 's-table', dashed: true },
  ],
})
