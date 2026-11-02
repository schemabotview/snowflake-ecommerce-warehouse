# Thumbnails

`film.png` — the thumbnail for the single full-course video (`scripts/out/film.mp4`): the dark
star card with the **Snowflake logo** (since 2026-11-02). Rebuild it, or any variant, with:

```sh
npm run thumb:film                                                   # film.png
npm run thumb:film -- --mark star --out output/thumbnails/film-starmark.png
```

`--mark` is `snowflake` (default) | `star`. Variants, all with the star mark: `film-starmark.png`
and `film-dark.png` (film.png before the logo), `film-ice.png` (paler blue), `film-light.png`
(stands out in a dark feed), `film-revenue.png` (the other source, below).

## The mark: Snowflake's logo, or ours

`film.png` carries the **Snowflake logo** (`--mark snowflake`), the owner's choice on 2026-11-02.
It is simple-icons' copy, vendored at `public/vendor/snowflake-logo.svg` in Snowflake's own
`#29B5E8`, and placed as supplied: the script never draws or alters it, and fails if the file is
missing. The logo is a Snowflake Inc. trademark. `public/vendor/NOTICE-snowflake-logo.txt` records
where the file came from, and has blanks to fill in before publishing: read Snowflake's brand
guidelines and get permission where they ask for it. This is a design note, not legal advice.

`--mark star` is the repo's own mark and needs no one's permission: a star schema, one fact square
and three dimension circles, outlined, white on the dark themes and the accent on the light one.
It is deliberately not a snowflake: a six-armed crystal of our own drawing would be the
"confusingly similar" derivative that trademark policies forbid.

## The two sources, both real

`--source star` (default, shipped) renders `spine/model/06-keys/session.txt`: the real
`queries/keys.sql`, recorded on the Snowflake trial, which LEFT JOINs `FCT_ORDER_LINES` to each
dimension and counts the matches: **35,043 fact rows, 35,043 matched in each of `DIM_DATE`,
`DIM_CUSTOMER` and `DIM_PRODUCT`**.

The card draws the picture every warehouse user knows (a fact table with its foreign keys,
pointing at its dimensions), but it is drawn from *this run*:

- one dimension box per join the query makes, never one it does not;
- each key row is the fact's column from the join's `ON` clause, each `key …` the dimension's;
- each `matched` count is that dimension's `COUNT(...)` column from the result.

If any dimension ever matched fewer rows than the fact holds, the render **fails**: the card says
"every row matched", and it may not say that about a run where it was not true.

`--source revenue` renders `spine/serve/01-revenue/session.txt`: the real
`dbt run --select mart_revenue` (PASS=1 ERROR=0) and the Black Friday week the same session
queried from `BI.MART_REVENUE`, with 2026-11-27 (€98,089) as the hero row.

The command and the numbers always come from the **same** session, never mixed.

## The colours are the engine's

The boxes take their tones from `@graphlearning/graphl-flow`'s dark palette, the same ones
`src/scenes/star.ts` gives the star in the scenes: the fact `serve` (`#c98bff`), the dimensions
`store` (`#37b877`), inner rows `neutral`. A dimension that failed to match would be marked in
`consume`. The headline accent is the repo's `--brand`, Snowflake blue `#29b5e8` (a deeper
`#1279a8` on the light theme, where the bright blue washes out).

## Why not `npm run thumb` (the shell's `graphl-thumb`)

That template is a **per-course** poster: 58% of a scene plus a text panel, which turns to mush at
the ~168px wide the YouTube mobile feed renders. `scripts/thumb-film.mjs` (ported from
spark-ecommerce-analytics) uses poster grammar instead: few elements, enormous type, one focal
object. Checked by downscaling to 168px: what survives is LEARN / SNOWFLAKE, the badge, and the
purple-fact, green-dimensions star as a shape.

## Guards

Everything on the card is parsed out of a spine `session.txt`; a missing command, join, count
column or result row is a hard error. The renderer asserts that no element overflows its box, and
the command line is **shrunk to fit, never truncated**.
