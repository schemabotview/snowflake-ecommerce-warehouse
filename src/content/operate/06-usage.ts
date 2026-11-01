import type { Section } from '../types'

export const usage: Section = {
  id: 'usage',
  title: "Usage views",
  scene: 'operate-usage',
  narration:
    "Every morning someone should check what the warehouse did while nobody was watching: what it cost, what failed, and who signed in. Snowflake keeps that record in a shared database called snowflake, in the schema account usage, readable by the account's administrator. The note explains how it differs from the information schema used throughout this course. The information schema answers immediately, for one database, for a few days. Account usage covers the whole account, for a year, but runs a few hours behind, which is why this step was recorded the next morning. The editor's file asks three questions. First, credits by warehouse since the trial opened: the first table in the side pane, from the run. The numbers move every day, so the narration does not read them out, but the order is the point: it shows which warehouses did the work. Second, tasks that failed, and why: the nightly build, with the error from last night, the same failure the d b t log explained. Third, who signed in, and how: Ana, by key pair, the two service users, each with its own key, and how many sign ins failed. These three queries are a good start for a morning check, and in a larger company they would feed a dashboard of their own. The warehouse is built, tested, served, and running on its own. One section remains: where it could go next.",
}
