# Learn Snowflake by building Shopwave's e-commerce warehouse: full course, beginner to professional — plan

**Plan status:** v1 (2026-11-01); infra built and Course 1 authored 2026-11-01 at the owner's go-ahead ("work on snowflake authoring"). Agreed with the owner: reuse Shopwave and
`shopwave_gen`; dbt as the transform tool; a 30-day Snowflake trial; 12 courses. Nothing is authored
yet. Shared rules (section shape, ◆ detours, packaging, build order) are in `CLAUDE.md`, "Shared
rules"; this plan states only what is specific to this concept.

## The idea

**Shopwave**, the online store whose data platform the Spark course built, now needs a **warehouse**:
one place where analysts, finance, marketing and BI ask questions of clean, modelled, governed data.
One project, `shopwave-dw`, builds it on Snowflake, from Shopwave's own database and files to tested
dbt marts, a dashboard and a share with the marketing agency.

The learner learns **data warehousing and Snowflake together**: every warehousing idea (OLAP,
Kimball's grain and stars, SCDs, fact types, ELT layers) and every Snowflake feature is taught **when
Shopwave first needs it**. Same business as `spark-ecommerce-analytics`, a different job: Spark
processed the data at scale; this course models it and serves it.

| Shopwave needs to… | warehousing teaches | Snowflake teaches | course |
| --- | --- | --- | --- |
| ask questions its shop database cannot answer | OLTP vs OLAP, why a warehouse exists | — | 1 |
| know what it pays for | — | storage / compute / services, warehouses, credits | 2 |
| start, on a budget | — | objects, sizing, auto-suspend, resource monitors, caches | 3 |
| let three teams in, safely | — | roles, the role hierarchy, grants, key-pair auth | 4 |
| bring the shop's data in | the raw layer, immutable | stages, `COPY INTO`, `VARIANT`, Snowpipe | 5 |
| answer "revenue by product by month" | Kimball: grain, facts, dimensions, the star | — | 6 |
| build it repeatably, tested | ELT layers: raw → staging → marts | dbt on Snowflake | 7 |
| know what a customer looked like when they ordered | SCD 1/2, late-arriving facts | dbt snapshots, streams, dynamic tables | 8 |
| follow an order from cart to return | transaction, snapshot and accumulating facts | `FLATTEN`, windows | 9 |
| make it fast and cheap | — | query profile, pruning, clustering, scaling | 10 |
| serve BI and a partner | marts, one metric definition, conformed dimensions | masking, row access, secure views, sharing | 11 |
| run it nightly, and change it safely | — | tasks, zero-copy clone, time travel, CI, usage views | 12 |

Prerequisites: SQL (`sql-bank`). The Spark course is not required; the business is re-introduced in
Course 1.

## Packaging

**One film: "Learn Snowflake by building an e-commerce data warehouse: full course, beginner to
professional"** — 12 courses, 90 sections, ~2 h (section ~80 s), titled *concept: what the warehouse
gets* (e.g. "Grain: one row per order line"). The film opens with the finished dashboard: Black
Friday revenue by category, from the warehouse.

## Stack and pins

| what | pin | role |
| --- | --- | --- |
| Snowflake | a 30-day trial, **Enterprise** edition, AWS `eu-west-2` (London) | the warehouse; Enterprise is needed for masking and row access policies, multi-cluster warehouses, materialised views, search optimisation, query acceleration |
| PostgreSQL | **18.6** (conda-forge, `sql-bank`'s `setup-postgres.sh`) | Shopwave's OLTP database, the source |
| `shopwave_gen` | pinned to a commit of `spark-ecommerce-analytics` | the data, byte-identical to the Spark course's |
| Python | **3.13.18** (dbt-snowflake 1.12.4 and the Snowflake CLI stop at 3.13) | the generator, dbt, scripts |
| dbt-core + dbt-snowflake | **1.12.6** + **1.12.4** | the transform layer |
| Snowflake CLI (`snow`) | **3.31.0**, in its OWN environment (pipx-style): it cannot share one with dbt-core 1.12 (pip finds no common resolution) | the terminal client |
| pyarrow | **26.0.0** | Parquet payments; the row/column lab (1.2) |

## The app: `shopwave-dw`

```
shopwave-dw/
  setup/                 roles.sql, warehouses.sql, databases.sql, monitors.sql        (3 → 4)
  load/                  stages.sql, file_formats.sql, copy_*.sql, pipe.sql            (5)
  dbt/
    models/staging/      stg_orders, stg_order_items, stg_customers, stg_products,
                         stg_payments, stg_returns, stg_clicks, stg_fx                 (7)
    models/marts/core/   dim_customer, dim_product, dim_date, dim_currency,
                         fct_order_lines                                               (6 → 8)
    models/marts/        fct_order_lifecycle, fct_returns, fct_sessions, fct_funnel,
                         fct_customer_monthly, fct_campaign_eligibility                (9)
    models/marts/bi/     mart_revenue, mart_cohorts, metrics                           (11)
    snapshots/           snap_customers, snap_products                                 (8)
    tests/               the planted-fault tests                                       (7 →)
  govern/                masking.sql, row_access.sql, share.sql                        (11)
  ops/                   tasks.sql, ci.yml                                             (12)
```

| After course | The warehouse can… |
| --- | --- |
| 3 Start | hold one table, on a warehouse that suspends itself under a monitored budget |
| 4 Secure | let a loader, a transformer and an analyst in, each only as far as needed |
| 5 Load | load every Shopwave source once, raw and immutable, JSON included |
| 6 Model | answer revenue by product by month from a star |
| 7 Transform | rebuild that star with dbt, tested, from raw |
| 8 History | report on what a customer and a price were at the time of each order |
| 9 Facts | follow orders, returns, sessions and the funnel |
| 10 Perform | answer the dashboard's queries fast, at a known cost |
| 11 Serve | serve BI one definition of revenue, mask PII, share with the agency |
| 12 Operate | rebuild nightly, change safely through CI on a clone |

## The data

`shopwave_gen` from `spark-ecommerce-analytics`, pinned to a commit and imported, never copied: same
seed and scale factor, same bytes as the Spark course. One year, 2026-01-01 → 2026-12-31, at SF 0.01
(20 k orders, 378 k click events) for every step; SF 0.1 for the performance course.

The warehouse needs one thing Shopwave's generator does not have: **customers that change**. A small
overlay, `shopwave_dw_gen`, adds them from its OWN random streams (keyed by seed and `'dw'`), so the
Spark course's bytes never move: customers who move country, and a loyalty tier (`bronze`, `silver`,
`gold`) that changes with spend.

| planted problem (generator) | the warehouse lesson | section |
| --- | --- | --- |
| clickstream schema change on 2026-06-01 (`context.device` → `context.device_type`, + consent) | schema evolution on load | 5.7 |
| returns in Latin-1, 3 malformed rows a month | file formats, `ON_ERROR` | 5.5, 5.8 |
| duplicate click events (0.5%) | dedupe in staging | 7.3 |
| unpaid (1%) and double-paid (0.3%) orders | custom dbt tests | 7.8 |
| 20% of products change price during the year | SCD2, the price at the time of order | 8.3, 8.4 |
| customers who move, loyalty tiers (overlay) | SCD2 on a dimension | 8.2 |
| events up to 3 days late | late-arriving facts | 8.5 |
| four currencies (EUR, GBP, USD, INR) | a currency dimension, no mixed sums | 8.6 |
| the order status lifecycle and its change feed | the accumulating snapshot; streams | 9.2, 8.7 |
| one bot, 8% of a day's page views | excluded from sessions and the funnel | 9.4 |
| Black Friday ×20; one bestseller is 15% of items | pruning, clustering, scaling | 10.2–10.4 |
| time-ranged campaigns | the factless fact | 9.8 |

## Facts

Frozen: frames quote them. Extend; never change a value a frame already quotes. The real account
identifier, URLs and user names are never shown: the recorder normalises them to the values below.

| fact | value |
| --- | --- |
| company | Shopwave (fictional online store); Ana, analytics engineer; teams: data (loading), analytics (dbt), BI and finance (reading); the marketing agency Brightline (a partner) |
| account | shown as `shopwave-dw` (`SHOPWAVE-DW.snowflakecomputing.com`): organisation `SHOPWAVE`, account name `DW`, locator `SW12345`, user `ANA`; Enterprise, AWS `eu-west-2`. The trial MUST be made in AWS eu-west-2: the region is real output, not normalised |
| warehouses | `WH_LOAD` XS, `WH_TRANSFORM` XS (S in 10.4), `WH_BI` XS multi-cluster 1–3; auto-suspend 60 s |
| budget | resource monitor `RM_MONTHLY`, 50 credits, notify 80%, suspend 100% |
| databases | `RAW` (schema `SHOPWAVE`), `ANALYTICS` (schemas `STAGING`, `MARTS`, `BI`), `ANALYTICS_DEV` (a clone) |
| roles | `LOADER`, `TRANSFORMER`, `ANALYST`, `REGION_MANAGER`, under `SYSADMIN`; users `ana`, `svc_loader`, `svc_dbt` (key-pair) |
| stage | `RAW.SHOPWAVE.LANDING` (internal); file formats `FF_CSV`, `FF_CSV_LATIN1`, `FF_JSON`, `FF_PARQUET` |
| core star | `fct_order_lines` (grain: one order line), `dim_customer` (SCD2), `dim_product` (SCD2), `dim_date`, `dim_currency` |
| PII | customer email masked for every role but `TRANSFORMER`; row access by country for `REGION_MANAGER` |
| share | `SHOPWAVE_CAMPAIGNS` to Brightline: campaign performance only, through a secure view |
| the opening answer | Black Friday (2026-11-27) revenue by category, in EUR, from `mart_revenue` |

Numbers (revenues, counts) are frozen when the pilot is recorded and added here then.

## Frames

- **IDE frame** (from `spark-ecommerce-analytics`' `ide.ts`): explorer | editor over terminal (the
  `snow` CLI, dbt, psql) | fixed side pane. A query's result is a `table` in the side pane, read from
  the transcript.
- **Map frame** (from `aws-ecommerce`'s `map.ts`): the warehouse's whole final shape — sources →
  `RAW` → `STAGING` → the star → marts → BI and the share, with the warehouses and roles beside it.
  A part not built yet is `muted`; a section's addition is ringed by `focus`. One fit for every map frame.
- **Star frame**: the dimensional model itself (fact in the centre, dimensions around it), one fixed
  layout from Course 6 on, so every later section adds to the same picture.
- **◆ full scene**: Snowflake's three layers, micro-partitions, OLTP vs OLAP, the grain, the dbt
  DAG, SCD types, fact types, the query profile, zero-copy clone — its own section, real output inside.
- Snowsight is never screenshotted: a query profile, a DAG or a dashboard is drawn from the query's,
  `EXPLAIN`'s, `GET_QUERY_OPERATOR_STATS`' or dbt's own output.

## The spine

`spine/<course>/<NN-step>/` = `project/` + `session.txt` + `step.json`, one cumulative chain. Two
kinds of step:

- **Local** (`{}`): replayed every time — the generator, its `verify`, PostgreSQL, staging files.
- **Snowflake** (`{"snowflake": true}`): **recorded once, never replayed** (`aws-ecommerce`'s method).
  The step runs once against the trial account when it is authored; its normalised transcript and a
  key (hash of the step) are committed; `check:spine` runs nothing and fails when a step changed
  without a re-record. The account's state carries forward along the chain.
- **The 30-day trial is a recording window.** Everything that does not need the account is authored
  first (scripts, dbt models, scenes from expected shapes); the account is opened when Course 2's
  steps are ready; courses are then recorded in order. A transcript stays valid after the trial ends,
  because nothing is replayed. If a re-record is needed after the trial, a new account replays the
  chain from the start (its key changes nothing that was recorded).
- **Credits are a budget**: XS warehouses, auto-suspend 60 s, SF 0.01 except Course 10.
- **Normalisation in the recorder**: account identifier, URLs, user names, query ids, timestamps,
  elapsed times. A transcript holding a fragment of a real id is refused.
- Query timings and credits are `volatile`: a scene reads them from the transcript; narration never
  says a timing as a fact about Snowflake.

## Verification levels

| level | means |
| --- | --- |
| `runs locally` | really run here: the generator, PostgreSQL, dbt's `parse` |
| `recorded on Snowflake` | run once on the trial account; the transcript is the record |
| `doc-cited` | Snowflake documentation says so; the URL is in the scene |
| `model` | a documented rule reproduced as a small program (e.g. credits per warehouse size); proves nothing about Snowflake |

## How a section teaches

Differences from the shared shape: a failure is its own step with real output (an
`Insufficient privileges`, a failing dbt test, a `COPY` error). A ◆ detour returns to the warehouse.

## The courses

Side pane = the diagram. ◆ = detour. Level: L runs locally · S recorded on Snowflake · D doc-cited ·
M model.

**1. `intro` · Why a warehouse · 3**

| # | Section | Step | Side pane | Level |
| --- | --- | --- | --- | --- |
| 1 | Questions the shop database cannot answer | psql: revenue by category by month on the OLTP schema | the join tree a single question needs | L |
| 2 | ◆ full scene: OLTP vs OLAP | lab: the same rows stored by row and by column | row store vs column store; normalised vs dimensional | L |
| 3 | What we'll build | concept | **the map**, every stage lit; under it, what each course adds. The Black Friday answer joins this frame when 11.8 is recorded | concept |

**2. `how-snowflake-runs` · How Snowflake is built · 7**

| # | Section | Step | Side pane | Level |
| --- | --- | --- | --- | --- |
| 1 | ◆ full scene: three layers | `SHOW WAREHOUSES`, `SHOW DATABASES` | storage / compute / cloud services, separately scaled | S |
| 2 | Virtual warehouses and credits | create `WH_LOAD` XS | sizes → credits per hour | S |
| 3 | ◆ full scene: micro-partitions | TPC-H `LINEITEM` (the sample share) copied into a transient `LAB` database, measured (rows, bytes, `SYSTEM$CLUSTERING_INFORMATION`), dropped: no Shopwave table exists before Course 3 | a table as immutable columnar micro-partitions + metadata | S |
| 4 | Organisations, accounts, clouds, regions | `SELECT CURRENT_ACCOUNT(), CURRENT_REGION()` | org → accounts → cloud and region | S |
| 5 | Editions | concept | what Standard / Enterprise / Business Critical add; what this course needs | D |
| 6 | Three clients | `snow` and the Python connector ask `CURRENT_CLIENT()`; Snowsight drawn, never shown (SnowSQL is superseded by `snow`) | every client → cloud services | S |
| 7 | What a query costs | lab: credits for a day of Shopwave | warehouse-seconds → credits; the 60-second minimum | M |

**3. `start` · The source, and a first warehouse · 7**

| # | Section | Step | Side pane | Level |
| --- | --- | --- | --- | --- |
| 1 | Shopwave's database | psql: `orders`, `order_items`, `customers`, `products` | the OLTP ER diagram | L |
| 2 | Databases and schemas | `RAW`, `ANALYTICS` | account → databases → schemas → objects | S |
| 3 | A first table and query | `products` exported from PostgreSQL, `PUT` to the table's own stage `@%PRODUCTS`, `COPY INTO`; queried (5.1 builds the named stage) | the round trip: client → services → warehouse → storage | S |
| 4 | Sizing and auto-suspend | one query over TPC-H SF10 `LINEITEM` (result cache off) on XS then S, timed by `QUERY_HISTORY_BY_SESSION`; `sleep 90`, then the state again | warehouse states over time: running, suspended | S |
| 5 | A budget that stops spend | `RM_MONTHLY`: notify 80%, suspend 100% | monitor → warehouses; thresholds | S |
| 6 | ◆ full scene: three caches | one TPC-H query: cold (after `SUSPEND`), warm, then twice with the result cache on; `QUERY_HISTORY_BY_SESSION` | result cache, warehouse cache, metadata | S |
| 7 | The project map | concept | the map, with what exists lit | S |

**4. `secure` · Roles before data · 8**

| # | Section | Step | Side pane | Level |
| --- | --- | --- | --- | --- |
| 1 | Users and roles | `CREATE USER ana`; `USE ROLE` | user → roles → privileges | S |
| 2 | ◆ full scene: the system roles | `SHOW ROLES` | ACCOUNTADMIN, SECURITYADMIN, USERADMIN, SYSADMIN, PUBLIC | S |
| 3 | Custom roles | `LOADER`, `TRANSFORMER`, `ANALYST` under `SYSADMIN` | the role tree | S |
| 4 | Grants and future grants | `GRANT … ON FUTURE TABLES` | object → privilege → role | S |
| 5 | Least privilege | the matrix applied | role × database × privilege | S |
| 6 | A refused query | `ANALYST` writes to `RAW` → `Insufficient privileges` | the missing grant, found | S |
| 7 | Service users and key pairs | `svc_loader`, `svc_dbt` with RSA keys | no password: key → JWT → session | S |
| 8 | Network policies | an allowed-IP list | where a login may come from | D |

**5. `load` · Getting data in · 9**

| # | Section | Step | Side pane | Level |
| --- | --- | --- | --- | --- |
| 1 | Stages | `PUT` files to `RAW.SHOPWAVE.LANDING` | local file → internal stage | S |
| 2 | File formats | `FF_CSV`, `FF_JSON`, `FF_PARQUET` | a format as a contract | S |
| 3 | `COPY INTO` | orders, items, customers, products | stage → table, file by file | S |
| 4 | A file loads once | the same `COPY` again: 0 rows | load metadata: 64 days of memory | S |
| 5 | `VALIDATION_MODE` and `ON_ERROR` | returns: the 3 bad rows | rows split: loaded / rejected | S |
| 6 | Semi-structured data | clicks into `VARIANT`; `:context.device` | JSON → one `VARIANT` column; paths | S |
| 7 | The June 1 schema change | `INFER_SCHEMA`; both shapes queried | old and new fields side by side | S |
| 8 | Latin-1 returns | `FF_CSV_LATIN1`: `Größe falsch` | bytes → encoding → text | S |
| 9 | Snowpipe | a pipe on the stage, `ALTER PIPE … REFRESH` | file → pipe → table, continuous; auto-ingest needs cloud events | S |

**6. `model` · Dimensional modelling · 9**

| # | Section | Step | Side pane | Level |
| --- | --- | --- | --- | --- |
| 1 | Kimball's four steps | concept | process → grain → dimensions → facts | D |
| 2 | ◆ full scene: the grain | one order, three possible grains | one row per order line, and why | S |
| 3 | The bus matrix | concept | processes × conformed dimensions | D |
| 4 | The fact table | `fct_order_lines` by hand-written SQL | the star frame: the fact | S |
| 5 | Dimensions | `dim_customer`, `dim_product`, `dim_date` | the star, three points | S |
| 6 | Surrogate keys | natural vs surrogate | why the warehouse owns its keys | S |
| 7 | ◆ full scene: star vs snowflake schema | category split out, the query compared | joins vs redundancy | S |
| 8 | Degenerate and role-playing dimensions | order id in the fact; order date vs ship date | one `dim_date`, two roles | S |
| 9 | The first answer | revenue by product by month | the star, lit by the query | S |

**7. `transform` · dbt on Snowflake · 9**

| # | Section | Step | Side pane | Level |
| --- | --- | --- | --- | --- |
| 1 | ELT layers | concept | raw → staging → marts; why transform after load | D |
| 2 | A dbt project | `dbt init`, `profiles.yml` as `svc_dbt`, sources | project → profile → Snowflake | S |
| 3 | Staging models | `stg_*`: rename, cast, dedupe clicks | one source → one staging model | S |
| 4 | ◆ full scene: `ref()` and the DAG | `dbt ls`, the manifest | the DAG drawn from `manifest.json` | L |
| 5 | Materialisations | view, table, ephemeral | what each builds in Snowflake | S |
| 6 | An incremental fact | `fct_order_lines` incremental, `merge` | first run vs next run | S |
| 7 | Generic tests | unique, not null, relationships, accepted values | tests on the DAG | S |
| 8 | Custom tests | unpaid and double-paid orders fail | the failing rows, found | S |
| 9 | Docs and lineage | `dbt docs generate` | lineage from source to mart | S |

**8. `history` · Time in the warehouse · 8**

| # | Section | Step | Side pane | Level |
| --- | --- | --- | --- | --- |
| 1 | ◆ full scene: SCD types | concept + one customer's moves | types 0, 1, 2, 3 on the same row | S |
| 2 | dbt snapshots | `snap_customers`: a move and a tier change | `dbt_valid_from` / `dbt_valid_to` rows | S |
| 3 | Price history | `snap_products` from the price changes | a product's prices over 2026 | S |
| 4 | The price at the time of order | point-in-time join to `dim_product` | an order line → the version valid that day | S |
| 5 | Late-arriving facts | a click 3 days late; an inferred member | the late row lands in the right day | S |
| 6 | Currency | `dim_currency`, daily rates; revenue in EUR | never sum mixed currencies | S |
| 7 | Streams | a stream on raw orders | change capture: offset → changed rows | S |
| 8 | Dynamic tables vs dbt incremental | the same model both ways | target lag vs scheduled runs | S |

**9. `facts` · Every kind of fact · 8**

| # | Section | Step | Side pane | Level |
| --- | --- | --- | --- | --- |
| 1 | ◆ full scene: three fact types | concept | transaction, periodic snapshot, accumulating snapshot | D |
| 2 | The order lifecycle | `fct_order_lifecycle`: placed → paid → shipped → delivered → returned | one row per order, its milestones filling in | S |
| 3 | Returns | `fct_returns` | returns joined to the lines they undo | S |
| 4 | Sessions | sessionising clicks with windows; the bot excluded | events → sessions by 30-minute gaps | S |
| 5 | The funnel | `fct_funnel`: view → cart → checkout → paid | the funnel, real counts | S |
| 6 | A periodic snapshot | `fct_customer_monthly` | one row per customer per month | S |
| 7 | Measures | additive, semi-additive, non-additive (AOV) | which sums are allowed | S |
| 8 | A factless fact | `fct_campaign_eligibility` | who could have used a campaign, and did not | S |

**10. `perform` · Fast and cheap · 7**

| # | Section | Step | Side pane | Level |
| --- | --- | --- | --- | --- |
| 1 | ◆ full scene: the query profile | `GET_QUERY_OPERATOR_STATS` on the dashboard query | operators, rows, time | S |
| 2 | Pruning | partitions scanned vs total, by date filter | the partitions skipped | S |
| 3 | Clustering keys | cluster `fct_order_lines` by date; depth before and after | overlap shrinking | S |
| 4 | Scale up vs scale out | XS vs S; a multi-cluster `WH_BI` under Black Friday load | bigger vs more | S |
| 5 | Materialised views and search optimisation | one each, measured | what each speeds up, what each costs | S |
| 6 | Query acceleration | a skewed scan | offloading part of a scan | S |
| 7 | Credits per model | `QUERY_HISTORY` by dbt model | where the credits went | S |

**11. `serve` · Serving BI and a partner · 8**

| # | Section | Step | Side pane | Level |
| --- | --- | --- | --- | --- |
| 1 | The revenue mart | `mart_revenue`: revenue, orders, AOV by day and category | the mart from the star | S |
| 2 | Cohort retention | `mart_cohorts` | the cohort triangle | S |
| 3 | One definition of revenue | a metrics model; two old answers reconciled | net of returns, in EUR, paid only | S |
| 4 | Masking policies | email masked for `ANALYST` | one column, two readers | S |
| 5 | Row access policies | `REGION_MANAGER` sees its countries | one table, two readers | S |
| 6 | Secure views | the campaign view | what a secure view hides | S |
| 7 | Sharing with Brightline | `SHOPWAVE_CAMPAIGNS` | share → consumer account, no copy | S |
| 8 | The dashboard | concept + lab: the queries behind it | Black Friday revenue by category | S |

**12. `operate` · Every night, and safe change · 7**

| # | Section | Step | Side pane | Level |
| --- | --- | --- | --- | --- |
| 1 | Tasks | a task graph: load → dbt build | the task DAG | S |
| 2 | Scheduling dbt | `dbt build` from a task | one nightly run, its results | S |
| 3 | ◆ full scene: zero-copy clone | `ANALYTICS_DEV` cloned from `ANALYTICS` | two names, one set of micro-partitions | S |
| 4 | Time travel and `UNDROP` | a dropped mart restored | versions over the retention period | S |
| 5 | CI on a clone | a pull request builds on a clone, tests, drops it | PR → clone → build → test → drop | S |
| 6 | Usage views | `ACCOUNT_USAGE`: cost, failed tasks, logins | what the account did last night | S |
| 7 | Where next | concept | Iceberg tables, Snowpark, Cortex — each on the map | D |

## Decisions

1. Concept: Snowflake and data warehousing together, through Shopwave's warehouse (2026-11-01).
2. Reuse Shopwave and `shopwave_gen` (pinned, imported); customer changes in an overlay with its own
   random streams.
3. dbt is the transform tool; streams, tasks and dynamic tables are taught beside it.
4. A 30-day Enterprise trial, recorded once per step; nothing replayed against Snowflake.
5. 12 courses, 90 sections, one film. Repo `snowflake-ecommerce-warehouse`, public.

6. Infra (2026-11-01): the replay runs every local step as the OS user `ana` (PostgreSQL's peer
   login), so `/home/ana/shopwave-dw` is the real path, not a rewritten one; `setup-postgres.sh` is
   sql-bank's, with `ana` for `dbteam`.
7. The recorder normalises identifiers, query ids and wall-clock timestamps; DURATIONS stay as
   Snowflake printed them (they are `volatile` facts scenes may read, never narration).
8. `shopwave_dw_gen`: 3% of customers draw a move, kept only between EUR countries (a move never
   changes the currency); tiers are a pure function of paid spend in 2026: silver at 1,000 EUR, gold
   at 2,500 EUR. At SF 0.01: 48 movers, 654 silver, 134 gold, 11 customers with three versions.

## Open

- Course 2 rests on four things a new trial is expected to have, confirmed only at recording: the
  shared `SNOWFLAKE_SAMPLE_DATA` database (2.1–2.3), `->>` (pipe) after `SHOW`, `COUNT(*)` answered
  from metadata, and the Python connector reading `connection_name` from `~/.snowflake/config.toml`.
  Any that fails is real output: the section is rewritten around what the run printed.

- **dbt v2.** dbt now prints "dbt v2 is available, and is the default for new installations" on
  every 1.12 command. The plan pins dbt Core 1.12 (`dbt-core` + `dbt-snowflake`, as agreed); the owner
  decides before Course 7 is authored whether the course teaches v2 instead. Either way the notice
  is real output and will appear in dbt panes unless the course says how to silence it.
- Star frame: built with its first section (6.4). The map frame is built (3.7): the map is wide and
  flat (1899 × 510 natural), so its frame stacks a fixed strip UNDER the map, not beside it.
- Course 3 also rests on: `INFORMATION_SCHEMA.QUERY_HISTORY_BY_SESSION()` returning `query_tag`,
  `warehouse_size`, `bytes_scanned`, `percentage_scanned_from_cache`; `PUT` to a table stage from `snow sql`.
- 11.7 needs a consumer account for Brightline: a second trial, or a reader account if the trial
  allows one.
- 5.9 shows Snowpipe with `ALTER PIPE … REFRESH` on an internal stage; auto-ingest needs an external
  stage with cloud event notifications (no AWS account here), so it is `doc-cited`.
- Whether 12.5's CI runs on GitHub Actions in this repo (needs the key pair as a repository secret).
