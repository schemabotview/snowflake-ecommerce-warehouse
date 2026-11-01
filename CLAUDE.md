# CLAUDE.md — snowflake-ecommerce-warehouse

> Source of truth: `COURSE-PLAN.md`. On the owner's machine the workspace rules are in
> `../CLAUDE.md`; a cloud session cannot see that file, so the rules this repo needs are copied
> under "Shared rules" below. Keep them in step with it.

## Identity

| | |
|---|---|
| teaches | data warehousing and Snowflake, by building `shopwave-dw`: Shopwave's e-commerce warehouse, from its database and files to tested dbt marts, a dashboard and a partner share |
| cast | Ana (analytics engineer), Shopwave's data, analytics, BI and finance teams; Brightline, the marketing agency |
| reference repos | all public under `github.com/schemabotview` — clone them beside this one, port, do not reinvent: **`spark-ecommerce-analytics`** (`shopwave_gen`, the IDE frame, `spine.py`, checks, registry, shots, film), **`aws-ecommerce`** (the map frame, the record-once spine, verification levels), **`sql-bank`** (`setup-postgres.sh`, psql consoles, result tables), **`databricks-retail-bank-lakehouse`** (normalising a real cloud account, credentials as secrets), **`python-expense-tracker`** (the original templates) |
| engine / shell | `@graphlearning/graphl-flow` ^0.8.0, `@graphlearning/shell` ^1.1.0, from npm. graphl-flow has brand `postgresql`, `snowflakedb`, `github`, `githubactions`; dbt has no mark (lucide `workflow`) |
| toolchain | see COURSE-PLAN, "Stack and pins": PostgreSQL 18.6, `shopwave_gen` (pinned commit), Python + dbt-core + dbt-snowflake + Snowflake CLI (pinned at the infra step) |
| frames | IDE, map, star (COURSE-PLAN, "Frames"); `--brand` Snowflake blue |
| secrets | `SNOWFLAKE_ACCOUNT`, `SNOWFLAKE_USER`, `SNOWFLAKE_PRIVATE_KEY` (key-pair, for recording): environment secrets, never committed, never printed |

## Status

Plan v1 written 2026-11-01, awaiting the owner's review. Nothing authored. Next, in order:

1. Owner review of `COURSE-PLAN.md`.
2. Infra (no content, no Snowflake account yet): scaffold from `spark-ecommerce-analytics` (vite,
   `package.json` scripts, `src/main.tsx`, `theme.css`, checks, registry, shots, film, the Colab
   notebook with `REPO = "snowflake-ecommerce-warehouse"`); `scripts/concept.json`, `titles.json`;
   import `shopwave_gen` at a pinned commit; `shopwave_dw_gen` (customer changes) + `verify`;
   `spine.py` with both step kinds (local replay, Snowflake record-once with normalisation); the
   map and star frames; pin the open versions.
3. Author every course's scripts and dbt models BEFORE opening the trial (COURSE-PLAN, "The spine":
   the 30 days are a recording window).
4. Open the trial; pilot = Course 7 `transform` (dbt, a failing test) plus the ◆ grain scene from
   Course 6 → owner review. Courses 2–6 must be recorded first, since the chain carries state.
5. Record the rest in order, each reviewed on its rendered routes, then narrated; then audio, record,
   film, cover.

| # | course | sections | status |
|---|---|---|---|
| 1 | `intro` | 3 | planned |
| 2 | `how-snowflake-runs` | 7 | planned |
| 3 | `start` | 7 | planned |
| 4 | `secure` | 8 | planned |
| 5 | `load` | 9 | planned |
| 6 | `model` | 9 | planned |
| 7 | `transform` | 9 | planned (pilot) |
| 8 | `history` | 8 | planned |
| 9 | `facts` | 8 | planned |
| 10 | `perform` | 7 | planned |
| 11 | `serve` | 8 | planned |
| 12 | `operate` | 7 | planned |

## Spine

See COURSE-PLAN, "The spine". The rules an author applies every step:

- **Local steps replay; Snowflake steps are recorded once.** Never re-run a Snowflake step to check
  it: `check:spine` compares keys and hashes only. Re-record a changed step and every Snowflake step
  after it, in order.
- **The trial is 30 days and its credits are finite**: XS warehouses, auto-suspend 60 s, SF 0.01
  except Course 10; check `RM_MONTHLY` before a long recording.
- **Normalise in the recorder, never by hand**: account identifier, URLs, user names, query ids,
  timestamps, elapsed times → the values in COURSE-PLAN, "Facts". The recorder refuses a transcript
  holding a fragment of a real id.
- **`shopwave_gen` is imported at a pinned commit, never edited here.** Anything the warehouse needs
  beyond it goes in `shopwave_dw_gen`, from its own random streams, so the Spark course's bytes never move.
- Timings and credits are `volatile`: scenes read them; narration never states one as a fact.

## Frames

The map's and the star's parts are fixed from the course they appear in; never rename a part. Every
map frame shares one fit; every IDE frame shares one fit. Snowsight is never screenshotted.

## Narration

Spell acronyms for the speech engine: "S Q L", "E L T", "O L T P", "O L A P", "S C D", "d b t" (for dbt),
"A O V", "P I I". Credits and money as words; ids never read out.

## Invariants

- Every frame states its verification level when it is not `runs locally` (COURSE-PLAN,
  "Verification levels").
- Revenue is in EUR through `dim_currency`; amounts in different currencies are never summed.
- No real account identifier, URL, user name or key is committed.

## Shared rules (copied from the workspace `../CLAUDE.md`)

**Vocabulary.** Concept = this repo = ONE YouTube film. Course = a chapter group and the owner's
review unit. Section = `(scene, narration)`: one full-screen 16:9 frame, one chapter, 82–120 s.
Scene = a declarative graphl-flow model. ◆ = a detour.

**Pipeline.** plan → infra → spine → author (`src/content/<course>/`, `src/scenes/<course>/`) →
check → `npm run gen:audio` (re-run after ANY narration edit) → Colab + Chatterbox
(`scripts/colab_generate_audio.ipynb` commits each wav to `main`) → `npm run record:all` →
`npm run film` → `npm run gen:desc`, `npm run thumb:film`.

**Commands.**

```sh
npm run dev                                          # :5173 — #/ catalog, #/<course>-<section>
npm run build && npx tsc --noEmit && npm run check   # check = check-content + check-render (4K)
npm run check:spine
npm run shots -- <course>                            # 4K PNGs in out/shots/ — then LOOK
```

**Invariants.**

- `COURSE-PLAN.md` is the source of truth: change it first, never drift.
- Route contract (the shell's, never reimplemented): `#/` catalog, `#/<courseId>-<sectionId>`,
  `#/<sceneId>`, `?capture=1`, `window.__scene.plan()`.
- Scenes are declarative: never `x`/`y`.
- Stylesheets in order: graphl-flow, shell, `./theme.css` last.
- Pin published engine and shell versions; no `file:` installs committed; no `overrides`.
- Every output is real: replayed or recorded, never typed. Scenes READ values from the spine (find
  lines by text with `lineOf`). `volatile` values are masked in comparison and never said in
  narration.
- Narration: `.tts` → `.wav` via Colab + Chatterbox only; audio at `public/audio/<course>/<id>.wav`.
  Flowing prose that walks the frame and ends with a one-line bridge; never reads code aloud; never
  claims the viewer has mastered anything.
- `SiteHeader` on the catalog page only.
- Checks are a floor, not proof: shoot and LOOK at every frame.

**Frames.** Every side pane carries a diagram, never a bullet list, and fills ≥ 2/3 of its height.
No edges between panes. A ◆ that cannot fit the side pane at ≥ 24px body text in the 4K frame is a
full scene, its own section with real output inside. Flows run one direction; arrows do not cross;
a fan-in of 3+ arrows aims at a tall node.

**How a section teaches.** Objective → mental model (side pane) → the code and its real result → a
failure or alternative → bridge. One step per section; a failure is its own step.

**Working agreement.** Author a whole course (spine, scenes, narration), render it, LOOK, then hand
over the routes. No silent scaffolding. Report what was built, verified and left out, and each
frame's verification level. Commit and push to `main` per course.
