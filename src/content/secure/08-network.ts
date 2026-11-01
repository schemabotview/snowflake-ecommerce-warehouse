import type { Section } from '../types'

export const network: Section = {
  id: 'network',
  title: "Network policies",
  scene: 'secure-network',
  narration:
    "A key can still be stolen, so Snowflake can also check where a login comes from. That is a network policy, and this frame is drawn from Snowflake's documentation rather than run, for a practical reason: a policy that allowed only Shopwave's addresses would lock out the machine this course is recorded on. On the left, two places a login can arrive from. Shopwave's loader server, at one fixed address, and anywhere else, which could be a stolen key on someone else's laptop. In the middle, the policy. It is built from a network rule, which lists the addresses that may connect in, and the policy names the rules whose addresses are allowed; everything else is blocked. It is checked before the key or the password, so a refused address never gets as far as trying one. A policy can be set on the whole account, or on a single user, and a user's own policy wins over the account's. On the right, the result. The loader's service user logs in from its server, and the same key, used from anywhere else, is refused. For Shopwave, the natural place to start is the service users, whose addresses never change, and then the whole account, once every person's network is known. That completes the account's security: roles for each team, grants that follow the data, keys for the programs, and a fence around the logins. Now the data can arrive.",
}
