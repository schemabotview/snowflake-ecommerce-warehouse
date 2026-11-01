"""Assert every planted change in the overlay is really there, and that shopwave_gen is untouched."""
from __future__ import annotations

import hashlib
from collections import Counter
from pathlib import Path

from shopwave_gen.model import CURRENCY

from .model import EUR_COUNTRIES, MOVE_SHARE, Overlay



def verify(o: Overlay) -> int:
    problems: list[str] = []
    ok: list[str] = []

    def check(cond: bool, good: str, bad: str) -> None:
        (ok if cond else problems).append(good if cond else bad)

    src = Path(__file__).resolve().parent.parent / 'shopwave_gen'
    pins = (src / 'PINNED.sha256').read_text().split('\n') if (src / 'PINNED.sha256').exists() else []
    want = dict(reversed(l.split('  ')) for l in pins if l)
    got = {f.name: hashlib.sha256(f.read_bytes()).hexdigest() for f in sorted(src.glob('*.py'))}
    check(bool(want) and got == want, 'shopwave_gen: byte-identical to the pinned commit',
          'shopwave_gen/*.py differ from shopwave_gen/PINNED.sha256 — it is imported, never edited here')

    moves = o.moves()
    n = len(o.world.customers())
    check(0.3 * MOVE_SHARE * n < len(moves) < 1.5 * MOVE_SHARE * n, f'moves: {len(moves)} of {n} customers move house',
          f'moves: {len(moves)} of {n} customers, not ~{MOVE_SHARE:.0%} of the EUR ones')
    check(all(m['country'] in EUR_COUNTRIES and m['old'] in EUR_COUNTRIES and m['country'] != m['old'] for m in moves),
          'moves: every move is between two EUR countries (the currency never changes)', 'a move changes currency')
    check(all(c not in CURRENCY for c in EUR_COUNTRIES), 'EUR countries pay in EUR', 'an EUR country pays in another currency')

    tiers = o.tier_changes()
    reached = Counter(t['loyalty_tier'] for t in tiers)
    check(0.15 * n < reached['silver'] < 0.5 * n and 0.02 * n < reached['gold'] < 0.15 * n,
          f"tiers: {reached['silver']} reach silver, {reached['gold']} reach gold",
          f'tiers: {dict(reached)} of {n} — a tier everyone (or nobody) reaches teaches nothing')
    per = Counter(t['customer_id'] for t in tiers)
    check(max(per.values()) <= 2, 'tiers: only ever up, bronze → silver → gold', 'a customer changes tier more than twice')

    changes = o.changes()
    both = {c['customer_id'] for c in changes if c['field'] == 'country'} & {c['customer_id'] for c in changes if c['field'] == 'tier'}
    check(len(both) > 0, f'{len(both)} customers both move and change tier: three versions of one row',
          'no customer both moves and changes tier')
    check(changes == sorted(changes, key=lambda c: c['changed_at']), 'changes are in time order', 'changes are out of order')

    for line in ok:
        print(f'✓ {line}')
    for line in problems:
        print(f'✗ {line}')
    return 1 if problems else 0
