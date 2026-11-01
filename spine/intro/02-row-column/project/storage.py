"""The same order lines, stored by row and by column: what each must read."""
import glob

import pyarrow as pa
import pyarrow.compute as pc
import pyarrow.csv as csv
import pyarrow.parquet as pq

files = sorted(glob.glob('data/raw/order_items/*.csv'))
lines = pa.concat_tables(csv.read_csv(f) for f in files)
rows, cols = lines.num_rows, lines.num_columns
print(f'order_items, 2026: {rows:,} rows x {cols} columns')

# A row store keeps each row's values together: one line per order line.
csv.write_csv(lines, 'rows.csv')
row_bytes = len(open('rows.csv', 'rb').read())

# A column store keeps each column's values together, compressed.
pq.write_table(lines, 'columns.parquet', compression='zstd',
               row_group_size=4096)
meta = pq.ParquetFile('columns.parquet').metadata
chunk = {meta.schema.column(c).name: 0 for c in range(cols)}
for g in range(meta.num_row_groups):
    for c in range(cols):
        col = meta.row_group(g).column(c)
        chunk[col.path_in_schema] += col.total_compressed_size
col_bytes = sum(chunk.values())
need = chunk['qty'] + chunk['unit_price']

print('\nrevenue = sum(qty * unit_price) over every line')
print(f'  by row    : reads {row_bytes:>9,} bytes, every column')
print(f'  by column : reads {need:>9,} bytes, qty and unit_price'
      f' ({need / row_bytes:.0%})')
print(f'  (all {cols} columns, compressed: {col_bytes:,} bytes)')
for name, size in chunk.items():
    print(f'    {name:<11} {size:>9,} bytes')

# One order: where are its lines, in each layout?
ORDER = 10_000
text = open('rows.csv').read().splitlines()[1:]
mine = [t for t in text if t.split(',')[0] == str(ORDER)]
first = pc.index(lines['order_id'], ORDER).as_py()
group = first // 4096
piece = sum(meta.row_group(group).column(c).total_compressed_size
            for c in range(cols))
print(f'\none order ({ORDER}): {len(mine)} lines')
print(f'  by row    : reads {sum(len(t) + 1 for t in mine):>9,} bytes,'
      ' its lines side by side')
print(f'  by column : reads {piece:>9,} bytes,'
      f' {cols} column chunks of row group {group}')
