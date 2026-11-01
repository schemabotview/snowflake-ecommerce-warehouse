# snowflake-ecommerce-warehouse

**Learn Snowflake by building an e-commerce data warehouse** — a GraphL concept app
(graphl.in/snowflake-ecommerce-warehouse). Shopwave, the online store from
[`spark-ecommerce-analytics`](https://github.com/schemabotview/spark-ecommerce-analytics), needs a
warehouse. One project, `shopwave-dw`, builds it on Snowflake: from the shop's PostgreSQL database
and files, through raw loads and a Kimball star, to tested dbt marts, a dashboard and a governed
share with its marketing agency. Data warehousing (OLAP, grain, facts and dimensions, SCDs, fact
types, ELT) and Snowflake (warehouses, credits, roles, stages, micro-partitions, clustering, clones,
time travel, sharing) are taught together, each when Shopwave first needs it. Every Snowflake output
is recorded on a real account. Planned as one film (12 courses, 90 sections). Prerequisite:
[`sql-bank`](https://github.com/schemabotview/sql-bank).

**Status:** infra built; Course 1 authored (no Snowflake account yet). See CLAUDE.md, "Status".
Plan: [`COURSE-PLAN.md`](COURSE-PLAN.md) · Rules and status: [`CLAUDE.md`](CLAUDE.md).

## Run

```sh
npm ci
npm run dev                                # http://localhost:5173 · #/<course>-<section>
npm run build && npx tsc --noEmit && npm run check   # content + 4K render
sudo bash scripts/setup-postgres.sh        # PostgreSQL 18.6, user ana (local steps)
sudo python3 scripts/spine.py              # replay local steps, check Snowflake records
```

## Layout

```
src/content/<course>/    one file per section (+ narration) and the course index
src/scenes/<course>/     declarative scenes; map.ts, star.ts, ide.ts
spine/<course>/<step>/   the real project + transcript at each step (local replay or Snowflake record)
shopwave_dw_gen/         the warehouse's overlay on shopwave_gen: customers that change
scripts/                 spine.py, checks, registry, shots, film, publishing data
```
