import type { SceneModel } from '@graphlearning/graphl-flow'

// §4.8 — Network policies. Doc-cited, NOT applied: docs.snowflake.com/en/user-guide/network-policies.
// A policy that allowed only Shopwave's addresses would lock out the machine this course records on.
// The address is from the documentation range (198.51.100.0/24), as in aws-ecommerce.
export const secureNetwork: SceneModel = {
  title: 'Network policies: where a login may come from',
  sub: 'Doc-cited, not applied here: an allow list would lock out the recording machine',
  dir: 'row',
  nodes: [
    {
      type: 'group', id: 'from', badge: 1, title: 'Logins arrive', icon: 'globe', tone: 'source', children: [
        { type: 'item', id: 'n-office', icon: 'building', title: 'Shopwave’s loader server', sub: '198.51.100.7' },
        { type: 'item', id: 'n-cafe', icon: 'laptop', title: 'Anywhere else', sub: 'a stolen key, a café' },
      ],
    },
    {
      type: 'group', id: 'policy', badge: 2, title: 'A network policy', sub: 'checked before the password or key', icon: 'shield', tone: 'infra', children: [
        { type: 'item', id: 'p-rule', icon: 'filter', title: 'A network rule', sub: 'MODE = INGRESS, VALUE_LIST = 198.51.100.7' },
        { type: 'item', id: 'p-allow', icon: 'check', title: 'An allow list', sub: 'the policy’s allowed network rules: all else blocked' },
        { type: 'item', id: 'p-where', icon: 'user', title: 'Set on the account, or one user', sub: 'a user’s policy overrides the account’s' },
      ],
    },
    {
      type: 'group', id: 'result', badge: 3, title: 'The result', icon: 'snowflakedb', tone: 'serve', children: [
        { type: 'item', id: 'r-in', icon: 'check', title: 'svc_loader logs in', sub: 'from its server only', tone: 'serve' },
        { type: 'item', id: 'r-out', icon: 'lock', title: 'Refused', sub: 'the key alone is not enough', tone: 'consume' },
      ],
    },
  ],
  edges: [
    { from: 'n-office', to: 'p-rule' },
    { from: 'p-allow', to: 'r-in', label: 'allowed' },
  ],
}
