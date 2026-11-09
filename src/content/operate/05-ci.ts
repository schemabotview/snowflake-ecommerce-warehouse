import type { Section } from '../types'

export const ci: Section = {
  id: 'ci',
  title: "CI on a clone",
  scene: 'operate-ci',
  narration:
    "Every change to the warehouse arrives as a pull request: a branch of the d b t project, with a description and a reviewer. Before it is merged, someone should prove it works on real data, and without touching production. That is continuous integration, and on Snowflake it is cheap, because of clones. The side pane's diagram is the whole flow, and the editor's file is the GitHub Actions workflow that would run it. For every pull request: clone production into a database named after the pull request, build and test the change on the clone, then drop the clone. In this course the workflow's steps were run here, by hand, through the script it calls; the second card says how it would run on GitHub, as the d b t service user, with its key stored as a repository secret. Pull request forty two adds tests to the revenue mart: its category must never be empty and must be one of the six known categories, and revenue must never be empty. The terminal shows the run. The clone is created. d b t builds the revenue mart, on the clone, and anything downstream of it, then runs the three new tests, and all three pass. Then the clone is dropped, and nothing is left behind. The first card says what was gained. Production was never touched: the change was proved on a copy of today's real data, and if a test had failed, the pull request would have been blocked before the merge. Last, the morning check: what the account did overnight.",
}
