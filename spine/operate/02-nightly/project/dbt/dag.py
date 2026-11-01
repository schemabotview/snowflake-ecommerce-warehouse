"""The DAG dbt built from ref() and source(), read from its manifest."""
import json
import textwrap

m = json.load(open('target/manifest.json'))
models = {k: v for k, v in m['nodes'].items() if v['resource_type'] == 'model'}
tests = [v for v in m['nodes'].values() if v['resource_type'] == 'test']
print(f"{len(models)} models, {len(m['sources'])} sources, {len(tests)} tests")
for node in sorted(models.values(), key=lambda n: (n['fqn'][1], n['name'])):
    parents = sorted(p.split('.')[-1] for p in node['depends_on']['nodes'])
    mat = node['config']['materialized']
    line = f"{node['name']:<18}{mat:<10}<- {', '.join(parents)}"
    print(textwrap.fill(line, 79, subsequent_indent=' ' * 31))
