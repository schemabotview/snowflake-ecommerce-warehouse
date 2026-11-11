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
| engine / shell | `@graphlearning/graphl-flow` 0.11.0, `@graphlearning/shell` 1.1.0, from npm, pinned exactly (IDE frame v2, COURSE-PLAN Decision 9). graphl-flow has brand `postgresql`, `snowflakedb`, `github`, `githubactions`; dbt has no mark (lucide `workflow`) |
| toolchain | COURSE-PLAN, "Stack and pins": Python 3.13.18, PostgreSQL 18.6, `shopwave_gen` @ `dc88dd7`, dbt-core 1.12.6 + dbt-snowflake 1.12.4, Snowflake CLI 3.31.0 (own env) |
| frames | IDE, map, star (COURSE-PLAN, "Frames"); `--brand` Snowflake blue |
| secrets | `SNOWFLAKE_ACCOUNT`, `SNOWFLAKE_USER`, `SNOWFLAKE_PRIVATE_KEY` (key-pair, for recording): environment secrets, never committed, never printed |

## Status

Plan v1 written 2026-11-01. Courses 1–12 authored; Courses 2–12 recorded on the owner's trial (AWS us-east-1); the pilot (Course 7) approved. Narrated (all 90 wavs), 4K-recorded (`record:all`, 2026-11-02) and filmed: `film.mp4` 2:10:10, 90 chapters; cover `output/thumbnails/film.png` (`thumb:film`, star source), `output/film-description.txt`.

**2026-11-09: ported to IDE frame v2** (COURSE-PLAN Decision 9; the explorer restored 2026-11-11).
All 69 IDE sections are on graphl-flow 0.11's shared grid (`src/scenes/frame.ts` `ideFrame2`,
workbench id `ide-bench`) in spark-ecommerce-analytics' layout: compact explorer 175 | editor over a
72-column terminal | side pane 434, titled with the section's mental model. The map, star-only and
concept frames are unchanged. 22 narrations changed: their wavs are removed and the manifest
regenerated, so check-content fails on those 22 until Colab regenerates them. Then every course is
re-recorded and the film re-cut: the recordings, film and cover above are v1. Nothing was
re-recorded on Snowflake.

Built: the app (vite, shell 1.1.0, graphl-flow 0.11.0, `--brand` #29b5e8), `src/scenes/ide.ts`
(aws-ecommerce's template; psql / snow / dbt / Python errors marked), `tree.ts`, `fold.ts`, `lab.ts`,
`map.ts` (every part and `BUILT` per course); checks, registry, shots, film, the Colab notebook;
`shopwave_gen` imported at spark-ecommerce-analytics `dc88dd7` (byte-checked by `PINNED.sha256`);
`shopwave_dw_gen` + `verify`; `scripts/spine.py` (local replay; Snowflake record-once with the
normaliser and its refusal — written, unit-tested on a fake account, NEVER yet run against Snowflake);
`scripts/setup-postgres.sh` (PostgreSQL 18.6). Next, in order:

1. Both frames are built: the map frame (`mapFrame`, 3.7) and the star (`star.ts`, 6.4).
   The Snowflake chain starts at `how-snowflake-runs/01-layers` (`first`), on the fresh trial.
2. Author every course's scripts and dbt models BEFORE opening the trial (COURSE-PLAN, "The spine").
3. Open the trial; pilot = Course 7 `transform` plus the ◆ grain scene from Course 6 → owner review.
4. Record the rest in order, each reviewed on its rendered routes, then narrated; then audio, record,
   film, cover.

| # | course | sections | status |
|---|---|---|---|
| 1 | `intro` | 3 | authored, rendered and looked at; not narrated (wavs) — 1.1 and 1.2 run locally, 1.3 concept |
| 2 | `how-snowflake-runs` | 7 | RECORDED on the trial (AWS us-east-1); 2.5 doc-cited, 2.7 model; frames and narration re-read against the run |
| 3 | `start` | 7 | RECORDED; 3.1 runs locally; 3.7 reads 3.3 and 3.5 |
| 4 | `secure` | 8 | RECORDED; 4.6 rewritten around secondary roles (what the run found); 4.8 doc-cited |
| 5 | `load` | 9 | RECORDED (after a failed first attempt: COURSE-PLAN, Open); 5.8 teaches reconciliation (767 lines sent, 185 loaded) |
| 6 | `model` | 9 | RECORDED; 6.1, 6.3 doc-cited; the star frame is built |
| 7 | `transform` | 9 | RECORDED (pilot) — APPROVED by the owner; 7.4 runs locally; 13 tests pass, the 2 custom tests fail on 191 and 55 planted rows |
| 8 | `history` | 8 | RECORDED; 8.1 runs locally; 8.2 snapshots from the start of the year (the first recording, at month ends only, lost customer 81's first version: re-recorded) |
| 9 | `facts` | 8 | RECORDED; 9.1 doc-cited; 9.5 teaches a funnel that widens (three lone purchase clicks after midnight); 9.7 AOV per customer |
| 10 | `perform` | 7 | RECORDED at SF 0.01; 10.1 a full scene from the run; 10.4 started a second WH_BI cluster; 10.6 ineligible (doc-cited why) |
| 11 | `serve` | 8 | RECORDED; masking and row access by CURRENT_ROLE(); 11.7 shared to a reader account (Brightline, BL67890); 11.8 a map frame |
| 12 | `operate` | 7 | RECORDED; nightly graph runs dbt inside Snowflake and FAILS on the planted faults (the alarm working); 12.3 a full scene; 12.5 CI steps run here; 12.7 doc-cited map frame |

## The machine

- `bash scripts/setup-postgres.sh` (root): PostgreSQL 18.6 from conda-forge, OS user and role `ana`.
- `python3 -m venv .venv && .venv/bin/pip install -r scripts/requirements-gen.txt`: the generator's
  pyarrow. `python3` must be 3.13.18 (`spine.py` refuses another).
- `python3 scripts/spine.py` (root) replays local steps as `ana` in `/home/ana/shopwave-dw` and
  checks Snowflake records without running them; `--write` rewrites local transcripts; `--record`
  needs the three secrets and runs Snowflake steps once, in chain order.
- `check:spine` stays RED until the trial is open and the Snowflake steps are recorded: it lists each
  as "not recorded". That is the true state, not noise; local steps must still all be ✓.
- A local step's data is generated by spec (`generated`, `"dw": true` for the overlay) and cached in
  `$SPINE_ROOT` (default `/tmp/shopwave-dw-spine`), with the shared venvs and the pinned `snow`.

## Spine

See COURSE-PLAN, "The spine". The rules an author applies every step:

- **Local steps replay; Snowflake steps are recorded once.** Never re-run a Snowflake step to check
  it: `check:spine` compares keys and hashes only. Re-record a changed step and every Snowflake step
  after it, in order.
- **The trial is 30 days and its credits are finite**: XS warehouses (WH_TRANSFORM S from 10.4), auto-suspend 60 s, SF 0.01; check `RM_MONTHLY` before a long recording.
- **Normalise in the recorder, never by hand**: account identifier, URLs, user names, query ids,
  timestamps, elapsed times → the values in COURSE-PLAN, "Facts". The recorder refuses a transcript
  holding a fragment of a real id.
- **`shopwave_gen` is imported at a pinned commit, never edited here.** Anything the warehouse needs
  beyond it goes in `shopwave_dw_gen`, from its own random streams, so the Spark course's bytes never move.
- Timings and credits are `volatile`: scenes read them; narration never states one as a fact.

## Frames

The map's and the star's parts are fixed from the course they appear in; never rename a part. Every
map frame shares one fit; every IDE frame shares one fit. Snowsight is never screenshotted.

**IDE frame v2** (`frame.ts` `ideFrame2`): one 1344 × 756 grid. Compact explorer 175 | editor over a
72-column terminal sharing 26 rows | side pane 434. The replay's 80-column transcripts are re-wrapped
when drawn (`rewrap`: a wrapped row is joined back unless it is a command or a complete grid row,
then every line is cut at 72; `keep` names the original rows). The terminal takes its rows after
`keep`'s folds, the editor the rest, windowed around its highlighted lines (a hand-picked `show` only
when they do not fit; it THROWS, naming the scene, when that does not either). Side pane TITLED
(`model`), ONE diagram (edges or a plot) and at most one table outside it, no notes or bullets
(check-content), filled ≥ 1/2 (check-render). A second table joins the diagram by an edge to the
TABLE itself, hoisted out of its titled group; a narrated aside is an `item` card. A table fits ~36
monospace characters a row (dates as MM-DD, long names cut with …). The star is two columns:
dimensions stacked left in key order, each its key and one column, the fact right.

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
