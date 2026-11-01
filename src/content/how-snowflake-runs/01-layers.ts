import type { Section } from '../types'

export const layers: Section = {
  id: 'layers',
  title: 'Three layers',
  scene: 'how-layers',
  narration:
    "Before we load anything, let's look at how Snowflake is built, because it explains how you pay for it. Snowflake is three layers, and each one scales on its own. At the top is cloud services. It is always on, and it is the part you talk to: it logs you in, checks your role, parses and optimises every query, and keeps the metadata about every table. In the middle is compute: virtual warehouses. A warehouse is a cluster of servers that runs the heavy part of a query, and it is billed per second, only while it runs. You can have many, one per team, and none of them slows another down. At the bottom is storage. Every table lives in cloud object storage, here on A W S in Northern Virginia, as compressed, columnar files, and storage is billed by the terabyte, whether or not any warehouse is running. The terminal on the right is a new trial account, asked four questions. Its version. Which warehouses exist: only the ones Snowflake makes for every trial, one of them, compute W H, running because the trial's own setup uses it. Which databases exist: Snowflake's own, a sample database shared into every account, and a personal one for the user. And how many orders are in one of the sample tables. Listing objects and counting a table's rows are questions about metadata, so cloud services can answer them alone, without needing a warehouse at all. Separate layers mean separate bills: you pay for compute only when you use it. So the next question is what a warehouse is, and what it costs.",
}
