import type { Section } from '../types'

export const masking: Section = {
  id: 'masking',
  title: "Masking policies",
  scene: 'serve-masking',
  narration:
    "The customer dimension holds email addresses, which are personal data. The analysts need customers, but not their emails, and the rule should hold whatever tool they use. Snowflake's answer is a masking policy: a small function attached to a column, which Snowflake applies to every query, before the result leaves. The first command lets the analytics team create masking policies in the marts. The editor's file creates the policy, P I I email: if the role a session is working as is the transformer, the email comes back as it is; for anyone else, the name is replaced with stars and only the domain is left, which is still enough to count customers by email provider. The policy checks current role on purpose. Ana holds every role, so her secondary roles always include the transformer, and the second card explains it: the policy answers to the one role she is working as, not every role she could use. Then d b t rebuilds the customer dimension, and there is a catch, on the first card. d b t replaces the table on every run, and a replaced table loses its policies. So the model attaches the policy itself, in a post hook, every time it builds. The last file reads customer eighty one twice. As the transformer, the side pane's table shows the real address. Then the same session switches to the analyst role, alone, as course four taught, and the same query returns stars and the domain. One column, two readers, one rule. Masking hides values. The next policy hides whole rows.",
}
