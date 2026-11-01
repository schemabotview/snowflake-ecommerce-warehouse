#!/usr/bin/env python3
"""The spine: replay every LOCAL step, check every SNOWFLAKE step's record — and record those once.

The course's one project is `shopwave-dw`, kept as real files: one snapshot per step in
spine/<course>/<NN-step>/project/. Each step's session.txt is the terminal pane a scene shows — `$ `
lines are commands, everything else is their output. Scenes import these files with Vite's `?raw`,
so a frame can only show what a real run printed.

  python3 scripts/spine.py                  check: replay every local step and compare; check every
                                            Snowflake step's record without running it
  python3 scripts/spine.py --write [steps]  re-run LOCAL steps and rewrite their session.txt / captured/
  python3 scripts/spine.py --record steps   run Snowflake steps ONCE against the account, in chain order,
                                            normalise, write session.txt, stamp state/recorded.json
  python3 scripts/spine.py start/03         (any mode) only the steps whose path starts with an argument

TWO KINDS OF STEP (COURSE-PLAN.md, "The spine"):

- LOCAL ({}): the generators, PostgreSQL, files, `dbt parse` — replayed on every check, exactly as in
  spark-ecommerce-analytics: the step's project is laid out at /home/ana/shopwave-dw and its
  commands run, one bash process per step, as the OS user `ana` (PostgreSQL's peer login), so the
  paths a learner sees are the paths the run had.
- SNOWFLAKE ({"snowflake": true}): RECORDED ONCE, NEVER REPLAYED (aws-ecommerce's method). The trial
  account is finite (30 days, a credit budget) and its state is the chain's state, so a check must
  not touch it. `--record` runs the step once, from the account as the step before it left it, and
  writes state/recorded.json: the step's KEY (a hash of every chain step up to it: step.json, files,
  typed commands — never the scripts) and the hash of the transcript it wrote. The check runs
  nothing: a key that no longer matches means the step, or a step before it, was edited — re-record
  it and EVERY Snowflake step after it, in order; a transcript whose hash no longer matches was edited
  by hand. A local step after a Snowflake step is still replayed (it never needs the account).

THE SPINE IS CUMULATIVE (python-expense-tracker's rule). Every step is the step before it plus the
changes it declares, and this script fails a step whose project differs from its parent's anywhere
it did not declare:

  {"first": true}               starts the chain
  {"from": "start/02-schemas",  continues that step; `changes` lists every path it adds, edits or
   "changes": ["setup/x.sql"]}  removes (a directory covers everything under it). A declared path that
                                did not change fails too. `[]` is a section that only looks.
  {"lab": true}                 a standalone lab outside the chain: real output a concept scene shows.
                                A Snowflake lab is recorded like a step, with no key (nothing before it)

step.json (other keys, all optional):
  {"snowflake": true}           recorded once against the account (above)
  {"generated": {"sf": 0.01, "from": "2026-01-01", "to": "2026-12-31", "only": ["orders"], "dw": true}}
                                data this step adds to its chain's: `python -m shopwave_gen` arguments
                                (cached by spec, written to data/raw or `dest`); "dw": true adds the
                                warehouse's overlay (python -m shopwave_dw_gen) beside it
  {"setup": ["cmd", ...]}       run silently before the session, as ana: only what is true off screen
                                (the shop's database as the shop runs it) — never the warehouse's state
  {"venv": true}                start with a venv for the project's requirements.txt activated (shared,
                                parked between steps by requirements hash, as in the Spark course)
  {"capture": ["path", ...]}    files the session writes that a scene shows; saved to captured/
  {"volatile": true}            compared with digits masked; or a list of kinds: ["digits", "uuid"],
                                ["clock"] (dbt's log-line clock and its "in 1.23s" timings only)
  {"time": "2026-11-09 09:00:00"}  Snowflake: the clock its normalised timestamps start from

NORMALISATION (Snowflake steps, COURSE-PLAN.md "Facts"): the real account identifier, locator,
organisation, host names and user name become the course's (`SHOPWAVE-DW`, `SHOPWAVE`, `DW`,
`SW12345`, `ANA`; the recorder asks the account for its names off screen); query ids become `01c0ffee-…-<n>` in order of first appearance; wall-clock
timestamps become the step's clock plus their order in seconds. A transcript that still holds a
fragment (4 characters or more) of a real identifier after that is REFUSED and nothing is written.
Durations (`in 1.84s`, `Elapsed`) stay as Snowflake printed them: they are `volatile` facts a scene
may read and narration never states.

THE RECORDING MACHINE needs three environment secrets (never committed, never printed):
SNOWFLAKE_ACCOUNT (`<org>-<account>`), SNOWFLAKE_USER, SNOWFLAKE_PRIVATE_KEY (an unencrypted PKCS#8
PEM). It writes ~/.snowflake/config.toml for ana off screen with one connection, `shopwave`, by key
pair; the session's `snow` commands use it. The account's own state is the only state Snowflake steps
carry: there is nothing to restore between them.
"""
from __future__ import annotations

import difflib
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
from datetime import datetime, timedelta
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
ROOT = REPO / 'spine'
USER = 'ana'
HOME = Path('/home') / USER
PROJECT = 'shopwave-dw'
SPINE_ROOT = Path(os.environ.get('SPINE_ROOT', '/tmp/shopwave-dw-spine'))
COLUMNS = 80
# Pins (COURSE-PLAN.md, "Stack and pins"): every output in the course comes from these.
PINNED_PYTHON = '3.13.18'
PINNED_PG = 'psql (PostgreSQL) 18.6'
SNOW_CLI = 'snowflake-cli==3.31.0'  # its own install: it conflicts with dbt-core in one environment
IGNORED = {'__pycache__', '.venv', 'data', 'target', 'logs', 'dbt_packages', 'out'}
MARK = '__SPINE_MARK__'
UUID = re.compile(r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')
# A Snowflake query id: 8-4-4-4-12 hex, the third group the deployment's (0000-…).
QUERY_ID = re.compile(r'\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b')
STAMP = re.compile(r'\b(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})(\.\d{1,9})?( ?[+-]\d{4}| ?Z)?')
SHOWN_ACCOUNT, SHOWN_HOST, SHOWN_USER, SHOWN_LOCATOR = 'SHOPWAVE-DW', 'shopwave-dw.snowflakecomputing.com', 'ANA', 'SW12345'


# ── the step graph ───────────────────────────────────────────────────────────────────────────────

def config_of(step: Path) -> dict:
    return json.loads((step / 'step.json').read_text()) if (step / 'step.json').exists() else {}


def every_step() -> list[Path]:
    return sorted(p.parent for p in ROOT.glob('*/*/session.txt'))


def files(step: Path) -> dict[str, bytes]:
    root = step / 'project'
    if not root.exists():
        return {}
    return {p.relative_to(root).as_posix(): p.read_bytes() for p in sorted(root.rglob('*'))
            if p.is_file() and not IGNORED & set(p.relative_to(root).parts) and p.suffix != '.pyc'}


def lineage(step: Path) -> list[str]:
    """Why this step is not its parent plus its declared changes (empty when it is)."""
    name, config = step.relative_to(ROOT), config_of(step)
    kinds = [k for k in ('first', 'from', 'lab') if config.get(k)]
    if len(kinds) != 1:
        return [f'{name}: step.json needs exactly one of "first", "from", "lab" (has {kinds or "none"})']
    if 'from' not in kinds:
        return [f'{name}: "changes" only means something with "from"'] if config.get('changes') else []
    parent = ROOT / config['from']
    if not (parent / 'session.txt').exists():
        return [f'{name}: "from" names {config["from"]}, which is not a step']
    if config_of(parent).get('lab'):
        return [f'{name}: "from" names a lab, which is outside the chain']
    if 'changes' not in config:
        return [f'{name}: "from" without "changes" — list the section diff ([] for a section that only looks)']
    changes = config['changes']
    under = lambda path, c: path == c or path.startswith(c.rstrip('/') + '/')
    before, after = files(parent), files(step)
    differs = {p for p in before.keys() | after.keys() if before.get(p) != after.get(p)}
    out = [f'{name}: {p} differs from {config["from"]} but is not in "changes"' for p in sorted(differs) if not any(under(p, c) for c in changes)]
    out += [f'{name}: "changes" lists {c}, which did not change' for c in changes if not any(under(p, c) for p in differs)]
    return out


def chain() -> list[Path]:
    """The chain's steps in order, from `first` along `from`; it must be one line."""
    steps = every_step()
    firsts = [s for s in steps if config_of(s).get('first')]
    children: dict[Path, list[Path]] = {}
    for s in steps:
        if config_of(s).get('from'):
            children.setdefault(ROOT / config_of(s)['from'], []).append(s)
    forks = {p: c for p, c in children.items() if len(c) > 1}
    if len(firsts) > 1 or forks:
        raise SystemExit('✗ the chain is not one line: ' + (f'{len(firsts)} "first" steps ' if len(firsts) > 1 else '')
                         + ' '.join(f'{p.relative_to(ROOT)} has {len(c)} children' for p, c in forks.items()))
    out, step = [], firsts[0] if firsts else None
    while step is not None:
        out.append(step)
        step = (children.get(step) or [None])[0]
    return out


def lineage_of(step: Path) -> list[Path]:
    out = [step]
    while config_of(out[0]).get('from'):
        out.insert(0, ROOT / config_of(out[0])['from'])
    return out


def commands(session: str) -> list[str]:
    return [line[2:] for line in session.splitlines() if line.startswith('$ ')]


def keys(line: list[Path]) -> dict[Path, str]:
    """One key per chain step: a hash of every step up to and including it — step.json, files, typed
    commands (not their output). The scripts are not in it: improving the machine forces no re-record."""
    h, out = hashlib.sha256(), {}
    for step in line:
        h.update((step / 'step.json').read_bytes())
        for rel, data in files(step).items():
            h.update(rel.encode() + b'\0' + hashlib.sha256(data).digest())
        h.update(repr(commands((step / 'session.txt').read_text())).encode())
        out[step] = h.hexdigest()[:20]
    return out


def transcript_hash(step: Path) -> str:
    h = hashlib.sha256((step / 'session.txt').read_bytes())
    for made in sorted(config_of(step).get('capture', [])):
        h.update(made.encode() + b'\0' + (step / 'captured' / made).read_bytes())
    return h.hexdigest()


def recorded(step: Path) -> dict:
    p = step / 'state' / 'recorded.json'
    return json.loads(p.read_text()) if p.exists() else {}


# ── the machine ──────────────────────────────────────────────────────────────────────────────────

def run_logged(args: list[str], **kw) -> None:
    r = subprocess.run(args, capture_output=True, text=True, **kw)
    if r.returncode:
        sys.exit(f'✗ `{" ".join(map(str, args))}` failed:\n{r.stdout}{r.stderr}')


def generator() -> str:
    venv = REPO / '.venv' / 'bin' / 'python'  # carries pyarrow (scripts/requirements-gen.txt)
    return str(venv) if venv.exists() else sys.executable


def data_specs(step: Path) -> list[dict]:
    out = []
    for s in lineage_of(step):
        spec = config_of(s).get('generated')
        out += spec if isinstance(spec, list) else [spec] if spec else []
    return out


def materialize(step: Path, project: Path) -> None:
    """Put the chain's generated data into the project (generated once per spec, cached)."""
    for spec in data_specs(step):
        gen = {k: v for k, v in spec.items() if k != 'dest'}
        cache = SPINE_ROOT / 'data' / hashlib.sha256(json.dumps(gen, sort_keys=True).encode()).hexdigest()[:16]
        if not cache.exists():
            tmp = cache.with_suffix('.tmp')
            shutil.rmtree(tmp, ignore_errors=True)
            only = [a for t in spec.get('only', []) for a in ('--only', t)]
            run_logged([generator(), '-m', 'shopwave_gen', '--sf', str(spec['sf']), '--out', str(tmp),
                        '--from', spec['from'], '--to', spec['to'], *only], cwd=REPO)
            if spec.get('dw'):
                run_logged([generator(), '-m', 'shopwave_dw_gen', '--sf', str(spec['sf']), '--out', str(tmp), '--to', spec['to']], cwd=REPO)
            tmp.rename(cache)
        shutil.copytree(cache, project / spec.get('dest', 'data/raw'), dirs_exist_ok=True)


def environment() -> dict:
    keep = ('PATH', 'LANG', 'LC_ALL', 'PIP_INDEX_URL', 'HTTPS_PROXY', 'HTTP_PROXY', 'NO_PROXY', 'https_proxy', 'http_proxy',
            'no_proxy', 'SSL_CERT_FILE', 'REQUESTS_CA_BUNDLE', 'PIP_CERT', 'CURL_CA_BUNDLE')
    env = {k: v for k, v in os.environ.items() if k in keep}
    # The machine's proxy CA (a cloud container's) lives under /root, which ana cannot read: the
    # replay gets its own readable copy. Nothing of it reaches a transcript.
    SPINE_ROOT.mkdir(parents=True, exist_ok=True)
    os.chmod(SPINE_ROOT, 0o755)
    for var in ('SSL_CERT_FILE', 'REQUESTS_CA_BUNDLE', 'PIP_CERT', 'CURL_CA_BUNDLE'):
        if env.get(var) and Path(env[var]).is_file():
            ca = SPINE_ROOT / 'ca-bundle.crt'
            shutil.copyfile(env[var], ca)
            os.chmod(ca, 0o644)
            env[var] = str(ca)
    cache = SPINE_ROOT / 'pip-cache'
    cache.mkdir(exist_ok=True)
    shutil.chown(cache, USER, USER)
    tools = SPINE_ROOT / 'tools' / 'snow' / 'bin'
    return {**env, 'HOME': str(HOME), 'USER': USER, 'LOGNAME': USER, 'PGHOST': '/tmp', 'NO_COLOR': '1', 'TERM': 'dumb',
            'COLUMNS': str(COLUMNS), 'PYTHON_COLORS': '0', 'PIP_DISABLE_PIP_VERSION_CHECK': '1', 'PS1': '',
            'DBT_SEND_ANONYMOUS_USAGE_STATS': 'False', 'DBT_USE_COLORS': 'False', 'DBT_PRINTER_WIDTH': str(COLUMNS), 'PIP_CACHE_DIR': str(SPINE_ROOT / 'pip-cache'),
            'PATH': f'{tools}:{env.get("PATH", "/usr/local/bin:/usr/bin:/bin")}'}


def as_ana(script: str, env: dict, cwd: Path) -> subprocess.CompletedProcess:
    return subprocess.run(['runuser', '-u', USER, '--', 'env', '-i', *(f'{k}={v}' for k, v in env.items()), 'bash', '-c', script],
                          cwd=cwd, capture_output=True, text=True)


def snow_cli() -> None:
    """The Snowflake CLI, pinned, in its own environment (a learner installs it with pipx)."""
    venv = SPINE_ROOT / 'tools' / 'snow'
    if not (venv / 'bin' / 'snow').exists():
        run_logged([sys.executable, '-m', 'venv', str(venv)])
        run_logged([str(venv / 'bin' / 'pip'), 'install', '-q', SNOW_CLI])
        os.chmod(SPINE_ROOT, 0o755)


def pem(key: str) -> str:
    """The private key as a PKCS#8 PEM file. An environment secret often holds only the base64 body
    (no BEGIN/END lines, no newlines): rebuild the armour around it."""
    key = key.strip()
    if key.startswith('-----BEGIN'):
        return key + '\n'
    body = ''.join(key.split())
    return '-----BEGIN PRIVATE KEY-----\n' + '\n'.join(body[i:i + 64] for i in range(0, len(body), 64)) + '\n-----END PRIVATE KEY-----\n'


def connection() -> dict[str, str]:
    """Write ana's Snowflake connection from the environment's secrets (off screen), ask the account
    for the names it prints (organisation, account name, locator), and return {real: shown} — what the
    normaliser replaces and the refusal looks for. Facts (COURSE-PLAN.md): organisation SHOPWAVE,
    account DW, identifier SHOPWAVE-DW, locator SW12345, user ANA."""
    missing = [v for v in ('SNOWFLAKE_ACCOUNT', 'SNOWFLAKE_USER', 'SNOWFLAKE_PRIVATE_KEY') if not os.environ.get(v)]
    if missing:
        sys.exit(f'✗ recording needs the environment secrets {", ".join(missing)} (CLAUDE.md, Identity)')
    account, user = os.environ['SNOWFLAKE_ACCOUNT'], os.environ['SNOWFLAKE_USER']
    cfg = HOME / '.snowflake'
    cfg.mkdir(parents=True, exist_ok=True)
    (cfg / 'rsa_key.p8').write_text(pem(os.environ['SNOWFLAKE_PRIVATE_KEY']))
    (cfg / 'config.toml').write_text(
        'default_connection_name = "shopwave"\n\n[connections.shopwave]\n'
        f'account = "{account}"\nuser = "{user}"\nauthenticator = "SNOWFLAKE_JWT"\n'
        f'private_key_file = "{cfg / "rsa_key.p8"}"\nrole = "SYSADMIN"\n')
    for p in (cfg, cfg / 'rsa_key.p8', cfg / 'config.toml'):
        os.chmod(p, 0o700 if p.is_dir() else 0o600)
    for p in (cfg, *cfg.iterdir()):
        shutil.chown(p, USER, USER)
    probe = as_ana('snow sql --format json -q "SELECT CURRENT_ORGANIZATION_NAME() AS O, '
                   'CURRENT_ACCOUNT_NAME() AS A, CURRENT_ACCOUNT() AS L"', environment(), HOME)
    try:
        row = json.loads(probe.stdout)[0]
    except (ValueError, IndexError, KeyError):
        sys.exit(f'✗ the connection does not work (output withheld: it may hold the account): exit {probe.returncode}')
    org, name, locator = row['O'], row['A'], row['L']
    shown = {f'{org}-{name}': SHOWN_ACCOUNT, f'{org}_{name}': SHOWN_ACCOUNT.replace('-', '_'), f'{org}.{name}': 'SHOPWAVE.DW',
             account: SHOWN_ACCOUNT, org: 'SHOPWAVE', name: 'DW', locator: SHOWN_LOCATOR, user: SHOWN_USER}
    return {k: v for k, v in shown.items() if k}


def lay_out(step: Path) -> Path:
    project = HOME / PROJECT
    shutil.rmtree(project, ignore_errors=True)
    HOME.mkdir(parents=True, exist_ok=True)
    if (step / 'project').exists():
        shutil.copytree(step / 'project', project)
    else:
        project.mkdir()
    materialize(step, project)
    return project


def venv(step: Path, project: Path, env: dict) -> Path | None:
    if not config_of(step).get('venv'):
        return None
    req = project / 'requirements.txt'
    if not req.exists():
        sys.exit(f'✗ {step.relative_to(ROOT)}: "venv": true needs a requirements.txt')
    parked = SPINE_ROOT / 'venvs' / hashlib.sha256(req.read_bytes()).hexdigest()[:16]
    if parked.exists():
        parked.rename(project / '.venv')
    else:
        subprocess.run(['chown', '-R', f'{USER}:{USER}', str(project)], check=True)
        r = as_ana('python3 -m venv .venv && .venv/bin/pip install -q -r requirements.txt', env, project)
        if r.returncode:
            sys.exit(f'✗ {step.relative_to(ROOT)}: the venv did not install:\n{r.stdout}{r.stderr}')
    env['PATH'] = f"{project / '.venv' / 'bin'}:{env['PATH']}"
    env['VIRTUAL_ENV'] = str(project / '.venv')
    return parked


def run(step: Path) -> tuple[str, dict[str, str]]:
    """Run one step's commands as ana; the transcript as an 80-column terminal shows it."""
    config = config_of(step)
    env = environment()
    if config.get('snowflake'):
        # dbt's profile reads the account from the environment, as a learner's would (profiles.yml
        # names the variable, never the value); the normaliser removes it from every output.
        env['SNOWFLAKE_ACCOUNT'] = os.environ.get('SNOWFLAKE_ACCOUNT', '')
    project = lay_out(step)
    parked = venv(step, project, env)
    subprocess.run(['chown', '-R', f'{USER}:{USER}', str(HOME)], check=True)
    try:
        for cmd in config.get('setup', []):
            r = as_ana(cmd, env, project)
            if r.returncode:
                sys.exit(f'✗ {step.relative_to(ROOT)}: setup `{cmd}` failed:\n{r.stdout}{r.stderr}')
        cwd, blocks = project, []
        state = HOME / '.spine-state'
        state.unlink(missing_ok=True)
        for cmd in commands((step / 'session.txt').read_text()):
            script = (state.read_text() if state.exists() else '') + f'cd {cwd}\n{{ {cmd}\n}} 2>&1\necho "{MARK}$PWD"\n'
            r = as_ana(script + f'declare -p VIRTUAL_ENV PATH 2>/dev/null | sed "s/^declare -x/export/; s/^declare --/export/" > {state}', env, cwd)
            output, _, after = r.stdout.partition(MARK)
            if after:
                cwd = Path(after.split('\n')[0])
            blocks.append(f'$ {cmd}' + (f'\n{output.rstrip()}' if output.strip() else ''))
        transcript = wrap('\n'.join(blocks)) + '\n'
        captured = {name: (project / name).read_text() for name in config.get('capture', [])}
    finally:
        if parked is not None and (project / '.venv').exists() and not parked.exists():
            parked.parent.mkdir(parents=True, exist_ok=True)
            (project / '.venv').rename(parked)
    return transcript, captured


def wrap(text: str) -> str:
    """Hard-wrap at the pane's 80 columns, as a real 80-column terminal does."""
    out = []
    for line in text.split('\n'):
        line = line.rstrip()
        while len(line) > COLUMNS:
            out.append(line[:COLUMNS])
            line = line[COLUMNS:]
        out.append(line)
    return '\n'.join(out)


def realign(text: str) -> str:
    """Re-pad the Snowflake CLI's result tables after names were replaced: a course name longer than
    the real one (SHOPWAVE for a 7-letter org) would push its cell past the column rule. Only
    whitespace and rule lengths change; no cell's text does."""
    lines, out, i = text.split('\n'), [], 0
    while i < len(lines):
        if not (lines[i].startswith('+-') and lines[i].endswith('-+')):
            out.append(lines[i]); i += 1; continue
        j = i + 1
        while j < len(lines) and lines[j].startswith('|'):
            j += 1
        if j >= len(lines) or not lines[j].startswith('+'):
            out.append(lines[i]); i += 1; continue
        rows = [[c.strip() for c in l[1:-1].split('|')] for l in lines[i + 1:j] if not l.startswith('|-')]
        widths = [max(len(r[k]) for r in rows) for k in range(len(rows[0]))] if rows and len({len(r) for r in rows}) == 1 else None
        if widths is None:
            out.extend(lines[i:j + 1]); i = j + 1; continue
        body = []
        for l in lines[i + 1:j]:
            if l.startswith('|-'):
                body.append('|' + '+'.join('-' * (w + 2) for w in widths) + '|')
            else:
                cells = [c.strip() for c in l[1:-1].split('|')]
                body.append('|' + '|'.join(f' {c:<{w}} ' for c, w in zip(cells, widths)) + '|')
        rule = '+' + '-' * (len(body[0]) - 2) + '+'
        out += [rule, *body, rule]
        i = j + 1
    return '\n'.join(out)


def normalise(text: str, names: dict[str, str], clock: str) -> str:
    """The real account → the course's (COURSE-PLAN.md, "Facts"). See the module docstring."""
    text = re.sub(r'\b[\w-]+(\.[\w-]+)*\.snowflakecomputing\.com', SHOWN_HOST, text, flags=re.I)
    for real in sorted(names, key=len, reverse=True):  # the whole identifier before its parts
        def sub(m: re.Match, shown: str = names[real]) -> str:
            # Keep a table column's width: pad a shorter name, or take a longer one's room from the
            # spaces after it, so psql's and snow's box tables stay aligned.
            word, room = m.group(1), m.group(2) or ''
            out = shown.lower() if word.islower() else shown
            if not room:  # prose, or a cell the name fills: no width to keep
                return out + ' ' * max(len(word) - len(out), 0) if m.group(3) is not None else out
            return out + ' ' * max(len(word) + len(room) - len(out), 1)
        # group 2: the spaces after a name that run up to a table's column rule; group 3: a rule right after it
        text = re.sub(rf'(?<![A-Za-z0-9])({re.escape(real)})(?![A-Za-z0-9])( +(?=[|│]))?((?=[|│]))?', sub, text, flags=re.I)
    text = realign(text)
    ids: dict[str, str] = {}
    text = QUERY_ID.sub(lambda m: ids.setdefault(m.group(0), f'01c0ffee-0000-0000-0000-{len(ids) + 1:012d}'), text)
    base = datetime.fromisoformat(clock)
    seen = sorted({(m.group(1), m.group(2), m.group(3) or '') for m in STAMP.finditer(text)})
    when = {k: base + timedelta(seconds=i) for i, k in enumerate(seen)}
    def stamp(m: re.Match) -> str:
        t = when[(m.group(1), m.group(2), m.group(3) or '')]
        frac = '.' + '0' * (len(m.group(3)) - 1) if m.group(3) else ''
        zone = (' ' if m.group(4) and m.group(4).startswith(' ') else '') + ('Z' if m.group(4) and 'Z' in m.group(4) else '+0000') if m.group(4) else ''
        return f'{t:%Y-%m-%d}{" " if " " in m.group(0)[:11] else "T"}{t:%H:%M:%S}{frac}{zone}'
    return STAMP.sub(stamp, text)


def refused(text: str, names: dict[str, str]) -> list[str]:
    """Every real name, or fragment of one 4 characters or longer, still in the text."""
    parts = {p for real in names for p in (real, *re.split(r'[-_.]', real)) if len(p) >= 4}
    # A user name is often a person's name, and objects get named after it (a warehouse JANE_WH from a
    # login JANEDOE42): every run of 5+ of its letters is a fragment too.
    user = os.environ.get('SNOWFLAKE_USER', '')
    parts |= {user[i:j] for i in range(len(user)) for j in range(i + 5, len(user) + 1) if user[i:j].isalpha()}
    shown = ' '.join(names.values()).lower()
    return sorted(p for p in parts if p.lower() in text.lower() and p.lower() not in shown)


def masked(text: str, step: Path) -> str:
    kinds = config_of(step).get('volatile')
    if not kinds:
        return text
    kinds = {'uuid', 'digits'} if kinds is True else set(kinds)
    if 'uuid' in kinds:
        text = UUID.sub('<uuid>', text)
    if 'clock' in kinds:  # dbt stamps every log line with the wall clock, and its run's timings
        text = re.sub(r'(?m)^\d\d:\d\d:\d\d  ', 'hh:mm:ss  ', text)
        text = re.sub(r'in \d+\.\d+s\b', 'in #s', text)
    return re.sub(r' *\d+(?:[.,]\d+)*', ' #', text) if 'digits' in kinds else text


def preflight(snowflake: bool) -> str | None:
    if os.geteuid() != 0:
        return 'run as root: steps run as the OS user ana (runuser), and PostgreSQL logs her in by peer'
    import platform
    if platform.python_version() != PINNED_PYTHON:
        return f'python3 is {platform.python_version()}, not {PINNED_PYTHON} (COURSE-PLAN.md, "Stack and pins")'
    pg = subprocess.run(['psql', '--version'], capture_output=True, text=True).stdout.strip()
    if pg != PINNED_PG:
        return f'`psql --version` says {pg!r}, not {PINNED_PG!r}: run scripts/setup-postgres.sh'
    if subprocess.run(['id', USER], capture_output=True).returncode:
        return f'no OS user {USER}: run scripts/setup-postgres.sh'
    if snowflake:
        snow_cli()
    return None


def main() -> int:
    write, record = '--write' in sys.argv, '--record' in sys.argv
    only = [a for a in sys.argv[1:] if not a.startswith('--')]
    steps = every_step()
    asked = lambda s: not only or any(str(s.relative_to(ROOT)).startswith(o) for o in only)
    problems = 0
    for p in (p for s in steps for p in lineage(s)):
        problems += 1
        print(f'✗ {p}')
    if problems and (write or record):
        print('✗ the chain is broken: fix step.json or the snapshots first')
        return 1
    line = chain()
    key = keys(line)
    snow = lambda s: bool(config_of(s).get('snowflake'))

    if record:
        targets = [s for s in line + [s for s in steps if config_of(s).get('lab')] if asked(s) and snow(s)]
        if not targets:
            print('✗ no Snowflake step matches: --record is for Snowflake steps (local steps: --write)')
            return 1
        problem = preflight(True)
        if problem:
            print(f'✗ {problem}')
            return 1
        names = connection()
        for step in targets:
            name = step.relative_to(ROOT)
            if step in key:  # the account must be in the state of the Snowflake step before it
                earlier = [s for s in line[:line.index(step)] if snow(s)]
                if earlier and recorded(earlier[-1]).get('key') != key[earlier[-1]]:
                    print(f'✗ {name}: {earlier[-1].relative_to(ROOT)} is not recorded as it is now — record the chain in order')
                    return 1
            transcript, captured = run(step)
            clock = config_of(step).get('time', '2026-11-09 09:00:00')
            transcript = normalise(transcript, names, clock)
            captured = {k: normalise(v, names, clock) for k, v in captured.items()}
            leaks = refused(transcript + ''.join(captured.values()), names)
            if leaks:
                print(f'✗ {name}: the transcript still holds {len(leaks)} fragment(s) of a real identifier — nothing written')
                return 1
            (step / 'session.txt').write_text(transcript)
            for file, text in captured.items():
                (step / 'captured' / file).parent.mkdir(parents=True, exist_ok=True)
                (step / 'captured' / file).write_text(text)
            (step / 'state').mkdir(exist_ok=True)
            (step / 'state' / 'recorded.json').write_text(json.dumps(
                {'key': key.get(step), 'transcript': transcript_hash(step), 'recorded': clock}, indent=1) + '\n')
            print(f'recorded {name}')
        stale = [s for s in line if snow(s) and recorded(s) and recorded(s).get('key') != key[s]]
        if stale:
            print(f'… now stale, downstream: {", ".join(str(s.relative_to(ROOT)) for s in stale)}')
        return 0

    local = [s for s in steps if asked(s) and not snow(s)]
    problem = preflight(False) if local else None
    if problem:
        print(f'✗ {problem}')
        return 1
    for step in (s for s in steps if asked(s)):
        name = step.relative_to(ROOT)
        if snow(step):
            if write:
                continue
            rec = recorded(step)
            if not rec:
                problems += 1
                print(f'✗ {name}: not recorded — python3 scripts/spine.py --record {name}')
            elif step in key and rec.get('key') != key[step]:
                problems += 1
                print(f'✗ {name}: stale — it, or a step before it, changed since it was recorded: --record {name} (and every Snowflake step after it)')
            elif rec.get('transcript') != transcript_hash(step):
                problems += 1
                print(f'✗ {name}: session.txt or captured/ was edited by hand — only a recording writes them')
            else:
                print(f'✓ {name} (recorded)')
            continue
        transcript, captured = run(step)
        if write:
            (step / 'session.txt').write_text(transcript)
            for file, text in captured.items():
                (step / 'captured' / file).parent.mkdir(parents=True, exist_ok=True)
                (step / 'captured' / file).write_text(text)
            print(f'wrote {name}')
            continue
        before = problems
        expected = (step / 'session.txt').read_text()
        if masked(transcript, step) != masked(expected, step):
            problems += 1
            print(f'✗ {name}: the terminal pane differs from a real run')
            sys.stdout.writelines(difflib.unified_diff(expected.splitlines(True), transcript.splitlines(True), 'session.txt', 'real run'))
        for file, text in captured.items():
            if (step / 'captured' / file).read_text() != text:
                problems += 1
                print(f'✗ {name}: captured/{file} differs from a real run')
        print(f'{"✗" if problems > before else "✓"} {name}')
    if not write:
        print(f"{'✗' if problems else '✓'} {sum(1 for s in steps if asked(s))} spine step(s), {problems} problem(s)")
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
