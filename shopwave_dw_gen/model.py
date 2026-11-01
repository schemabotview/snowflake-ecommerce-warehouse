"""The warehouse's overlay on shopwave_gen: customers that CHANGE.

shopwave_gen is imported unchanged from spark-ecommerce-analytics (shopwave_gen/PINNED), so its bytes
— the Spark course's — never move. What the warehouse needs beyond it is drawn here, from this
module's OWN random streams (keyed by seed and 'dw'), reading shopwave_gen's tables but never
drawing from theirs:

- MOVES: a share of customers move house once during the year, to another EUR country, so a
  customer's country changes but the currency they pay in does not (Course 8's SCD Type 2 on
  dim_customer). shopwave_gen's `orders.country` is the country the shop recorded at checkout and
  stays as it was: the warehouse reads a customer's country from dim_customer, as of the order.
- LOYALTY TIERS: everyone starts `bronze`; a customer becomes `silver` the moment their paid spend
  for the year reaches SILVER_EUR and `gold` at GOLD_EUR. No randomness: a tier is a pure function of
  the orders, and changes at the timestamp of the order that crossed the threshold.

Every planted problem here is a named constant, asserted by verify.py.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, time, timedelta, timezone
from decimal import Decimal
from functools import cache

from shopwave_gen.model import CURRENCY, FIRST, LAST, World, days, rng

MOVE_SHARE = 0.03  # customers who move house once in 2026
SILVER_EUR = Decimal('1000')  # paid spend in the year that makes a customer silver
GOLD_EUR = Decimal('2500')  # … and gold
TIERS = ('bronze', 'silver', 'gold')
EUR_COUNTRIES = sorted(c for c in ('DE', 'FR', 'NL', 'ES', 'IT', 'IE', 'BE', 'AT') if c not in CURRENCY)


@dataclass(frozen=True)
class Overlay:
    world: World

    @property
    def seed(self) -> int:
        return self.world.seed

    @cache
    def moves(self) -> list[dict]:
        """(customer_id, changed_at, country): one move per mover, to another EUR country."""
        r = rng(self.seed, 'dw', 'moves')
        out = []
        for c in self.world.customers():
            # Every customer draws the same three numbers, mover or not: one customer's draw never
            # shifts another's.
            moves, when, where = r.random() < MOVE_SHARE, r.randrange(1, 364), r.randrange(len(EUR_COUNTRIES) - 1)
            if not moves or c['country'] not in EUR_COUNTRIES:
                continue
            others = [x for x in EUR_COUNTRIES if x != c['country']]
            at = datetime.combine(FIRST + timedelta(days=when), time(9), tzinfo=timezone.utc) + timedelta(seconds=r.randrange(9 * 3600))
            out.append({'customer_id': c['customer_id'], 'changed_at': at, 'old': c['country'], 'country': others[where]})
        return out

    @cache
    def tier_changes(self, last: date = LAST) -> list[dict]:
        """(customer_id, changed_at, loyalty_tier) for every tier a customer reaches by `last`."""
        spend: dict[int, Decimal] = {}
        tier: dict[int, int] = {}
        out = []
        for d in days(FIRST, last):
            for o in self.world.day(d)['orders']:
                if o['status'] != 'paid':
                    continue
                cid = o['customer_id']
                spend[cid] = spend.get(cid, Decimal(0)) + o['total']
                reached = 2 if spend[cid] >= GOLD_EUR else 1 if spend[cid] >= SILVER_EUR else 0
                for t in range(tier.get(cid, 0) + 1, reached + 1):
                    out.append({'customer_id': cid, 'changed_at': o['order_ts'], 'old': TIERS[t - 1], 'loyalty_tier': TIERS[t]})
                tier[cid] = max(tier.get(cid, 0), reached)
        return out

    def changes(self, last: date = LAST) -> list[dict]:
        """The customer table's changes, in time order: the row's full new state after each one."""
        country = {c['customer_id']: c['country'] for c in self.world.customers()}
        tier = {c['customer_id']: 'bronze' for c in self.world.customers()}
        events = [('country', m) for m in self.moves() if m['changed_at'].date() <= last]
        events += [('tier', t) for t in self.tier_changes(last)]
        events.sort(key=lambda e: (e[1]['changed_at'], e[1]['customer_id'], e[0]))
        out = []
        for kind, e in events:
            cid = e['customer_id']
            if kind == 'country':
                country[cid] = e['country']
            else:
                tier[cid] = e['loyalty_tier']
            out.append({'customer_id': cid, 'changed_at': e['changed_at'], 'field': kind,
                        'country': country[cid], 'loyalty_tier': tier[cid]})
        return out
