"""Write the warehouse's overlay on Shopwave's data (shopwave_dw_gen/model.py says what and why).

  python -m shopwave_dw_gen --sf 0.01 --out data/raw                 the whole year
  python -m shopwave_dw_gen --sf 0.01 --out data/raw --to 2026-06-30  changes up to a day
  python -m shopwave_dw_gen verify --sf 0.01                         assert every planted change

Same seed and SF → byte-identical files. Writes, under --out:

  customer_changes.csv   customer_id, changed_at, field (country | tier), country, loyalty_tier:
                         the customer row's whole new state after each change, in time order
"""
from __future__ import annotations

import argparse
import sys
from datetime import date
from pathlib import Path

from shopwave_gen.__main__ import write_csv
from shopwave_gen.model import LAST, World

from .model import Overlay


def main(argv: list[str]) -> int:
    p = argparse.ArgumentParser(prog='python -m shopwave_dw_gen', description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('command', nargs='?', choices=['write', 'verify'], default='write')
    p.add_argument('--sf', type=float, default=0.01)
    p.add_argument('--seed', type=int, default=2026)
    p.add_argument('--out', type=Path, default=Path('data/raw'))
    p.add_argument('--to', dest='last', type=date.fromisoformat, default=LAST)
    a = p.parse_args(argv)
    overlay = Overlay(World(a.seed, a.sf))
    if a.command == 'verify':
        from .verify import verify
        return verify(overlay)
    write_csv(a.out / 'customer_changes.csv', overlay.changes(a.last))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
