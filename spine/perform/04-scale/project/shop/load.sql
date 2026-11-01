-- The shop's 2026, as shopwave_gen writes it (data/raw).
\copy customers FROM 'data/raw/customers.csv' CSV HEADER
\copy products FROM 'data/raw/products.csv' CSV HEADER
\copy orders FROM PROGRAM 'tail -q -n +2 data/raw/orders/*.csv' CSV
\copy order_items FROM PROGRAM 'tail -q -n +2 data/raw/order_items/*.csv' CSV
ANALYZE;
