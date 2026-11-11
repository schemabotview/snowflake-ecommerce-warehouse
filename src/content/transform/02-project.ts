import type { Section } from '../types'

export const project: Section = {
  id: 'project',
  title: "A dbt project",
  scene: 'transform-project',
  narration:
    "A d b t project is a folder of S Q L and a little configuration. The first command moves into it, the second shows the versions pinned for this course, and the third asks d b t to check that it can reach Snowflake. Three files make it a project. The explorer shows d b t project dot y m l, which names the project and says where each layer lands: staging models as views in the staging schema, marts as tables in the marts schema. A small macro beside it makes those schema names exactly staging and marts, instead of d b t's default of prefixing them. And sources dot y m l lists the eight raw tables d b t may read, so that every model refers to them by name. The editor shows the third file, profiles dot y m l: how d b t connects. Look at the side pane to follow that chain. The project names a profile. The profile says who connects: the service user S V C D B T from course four, by key pair, with the private key read from the file on this machine. Its role is the transformer, on W H transform, so everything course four granted applies: read raw, build in analytics, nothing else. Notice what is not in the profile: any secret. The account comes from an environment variable and the key from a file, so this file can be committed and shared. When d b t debug reports that every check passes and the connection is fine, the project is ready for its first models.",
}
