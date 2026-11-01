"""One model's lineage, from the manifest docs generate wrote."""
import json
import sys

m = json.load(open('target/manifest.json'))
nodes = {**m['nodes'], **m['sources']}
by_name = {v['name']: k for k, v in m['nodes'].items()}


def up(key, depth=0):
    node = nodes[key]
    source = key.startswith('source.')
    kind = 'source' if source else node['config']['materialized']
    print(f"{'  ' * depth}{node['name']} ({kind})")
    for parent in sorted(node.get('depends_on', {}).get('nodes', [])):
        up(parent, depth + 1)


up(by_name[sys.argv[1]])
