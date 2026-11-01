import type { Section } from '../types'

export const next: Section = {
  id: 'next',
  title: "Where next",
  scene: 'operate-next',
  narration:
    "The map at the top is finished: every part of Shopwave's warehouse, from the shop's database and files on the left, through raw, staging, the star and the marts, to the dashboard and the share with Brightline on the right, with the compute, the access rules and the operations around it. Every one was built in this course and recorded on a real Snowflake account. Snowflake does more than this warehouse needed, and the strip under the map points at three things worth learning next, each tied to the part of the map it would change. Nothing is run here; each card cites Snowflake's documentation. First, Iceberg tables, beside raw. These are tables kept in an open format, in your own cloud storage, which Snowflake can query and other engines, such as Spark, can read too. Shopwave would want them if another team, with another tool, needed the same raw files. Second, Snowpark, beside operations. It runs Python and Java inside the warehouse, next to the data, for the logic S Q L expresses badly, such as a sales forecast or a machine learning model. Third, Cortex, beside B I. It offers language models as S Q L functions, so a query could, for example, read the returns' reasons, written in four languages in course nine, and sort them into one list. Each is a course of its own. This one ends here, with a warehouse that loads, models, tests, keeps history, performs, serves its readers, and runs itself every night.",
}
