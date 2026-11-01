"""A day of Shopwave in credits: Snowflake's billing rules, modelled.

The rules (docs.snowflake.com/en/user-guide/warehouses-overview):
  credits per hour by size: XS 1, S 2, M 4, L 8 (standard warehouses)
  per-second billing, with a 60-second minimum each time a warehouse starts
  idle for AUTO_SUSPEND seconds, it suspends; the next query resumes it
The day below is ASSUMED, not measured: what Shopwave plans to run.
"""
CREDITS_PER_HOUR = {'XS': 1, 'S': 2, 'M': 4, 'L': 8}
H = 3600

# (warehouse, size, [(start second of the day, seconds of work), ...])
DAY = [
    ('WH_LOAD', 'XS', [(2 * H, 240)]),                  # the nightly load
    ('WH_TRANSFORM', 'XS', [(2 * H + 600, 420)]),      # dbt build
    ('WH_BI', 'XS', [(8 * H + q * 900, 3)               # dashboard refresh
                     for q in range(41)]),              # every 15 min, 8-18
]


def billed(queries, auto_suspend):
    """Seconds billed: each run lasts from a resume to auto_suspend
    seconds after its last query, and is billed at least 60 seconds."""
    total, run_start, run_end = 0, None, None
    for start, work in sorted(queries):
        if run_end is not None and start <= run_end:    # still running
            run_end = max(run_end, start + work + auto_suspend)
            continue
        if run_end is not None:
            total += max(60, run_end - run_start)
        run_start, run_end = start, start + work + auto_suspend
    return total + max(60, run_end - run_start)


def credits(size, seconds):
    return CREDITS_PER_HOUR[size] * seconds / H


print('a modelled day: per-second billing, 60 s minimum, AUTO_SUSPEND 60')
print(f'{"warehouse":<13}{"size":<5}{"queries":>7}{"working":>9}'
      f'{"billed":>9}{"credits":>9}')
day = [0, 0, 0.0]
for name, size, queries in DAY:
    work, bill = sum(w for _, w in queries), billed(queries, 60)
    day = [day[0] + work, day[1] + bill, day[2] + credits(size, bill)]
    print(f'{name:<13}{size:<5}{len(queries):>7}{work:>7} s'
          f'{bill:>7} s{credits(size, bill):>9.3f}')
print(f'{"the day":<25}{day[0]:>7} s{day[1]:>7} s{day[2]:>9.3f}')
print(f'a 30-day month: {30 * day[2]:.1f} credits of RM_MONTHLY\'s 50')

bi = DAY[2][2]
for suspend in (600, 1):
    bill = billed(bi, suspend)
    print(f'WH_BI at AUTO_SUSPEND {suspend:>3}: {bill:>6} s billed,'
          f' {credits("XS", bill):.3f} credits')
