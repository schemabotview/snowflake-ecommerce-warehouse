import type { Section } from '../types'

export const scale: Section = {
  id: 'scale',
  title: "Scale up vs scale out",
  scene: 'perform-scale',
  narration:
    "A warehouse can be made faster in two different ways, and they solve different problems. The side pane's first diagram sets them side by side. Scaling up means a bigger size. Each size up doubles the compute and doubles the credits per hour, and it helps one heavy job, like d b t's biggest models, finish sooner. Scaling out means more clusters of the same size. It does not make any single query faster, but it lets more queries run at the same moment, which is what a dashboard needs when everyone opens it at once. The first two commands, as an administrator, do both. The analytics team's warehouse goes from extra small to small, and the B I warehouse may now run up to three clusters, with the standard scaling policy. The second table shows the warehouses afterwards, from the run. Then the editor's script plays Black Friday morning. It connects as an analyst on the B I warehouse and sends the dashboard query ninety six times, without waiting for any of them to finish, so they all arrive together. When they are done, it asks the warehouse's own history which cluster ran each query, and how long the longest one waited in a queue. The third table is the answer. Snowflake started a second cluster when the queries began to queue, and that cluster took a few of them; no query waited long enough to show. That is scaling out doing its job. Compute is one way to answer faster. Storing the answer in advance is another.",
}
