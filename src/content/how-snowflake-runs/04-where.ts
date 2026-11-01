import type { Section } from '../types'

export const where: Section = {
  id: 'where',
  title: 'Organisations, accounts, clouds, regions',
  scene: 'how-where',
  narration:
    "Every Snowflake account lives somewhere, and the query in the editor asks where. Four functions: the organisation, the account's name, its locator, and its region. The terminal shows the answers, and the side pane draws them. At the top is the organisation, which is the company. It owns the accounts, and it is where billing and contracts live. Shopwave has one account today. A bigger company might have one for production, one for development, and one in another region, all under one organisation. Each account runs in exactly one cloud and one region, here A W S in Northern Virginia, in the United States, which matters for two reasons: your data stays in that region, and moving data to an account in another region costs transfer fees. A European shop like Shopwave would normally choose a European region for its customers' data; this course's trial account happens to run in the United States. An account has two names. The modern one is the organisation name and the account name, joined by a hyphen, and that is what the connection on this machine uses, and what you will see in every web address. The older one is the locator, a short code tied to the region, which some tools and older documentation still ask for. One thing on screen is not quite what Snowflake printed. The real names of the trial account behind this course are replaced, as it is recorded, with the names Shopwave uses, so no real account identifier ever appears in a frame. The shape of the answer is real; only the names are swapped. Next, what each edition of Snowflake adds, and why this course needs Enterprise.",
}
