"""Black Friday morning: 96 dashboard loads at once on WH_BI, as ANALYST.

Every query is sent without waiting (execute_async), so they all arrive
together; then the warehouse's own history says which cluster ran each.
"""
import time
import snowflake.connector

LOADS = 96
DASHBOARD = """
SELECT d.date, p.category, SUM(f.amount_eur) AS revenue_eur
FROM FCT_ORDER_LINES AS f
JOIN DIM_DATE AS d ON d.date_key = f.order_date_key
JOIN DIM_PRODUCT AS p ON p.product_key = f.product_key
WHERE d.date BETWEEN '2026-11-01' AND '2026-11-30'
GROUP BY 1, 2"""
HISTORY = """
SELECT cluster_number, COUNT(*) AS queries,
       MAX(queued_overload_time) AS longest_wait_ms
FROM TABLE(INFORMATION_SCHEMA.QUERY_HISTORY_BY_SESSION(
    RESULT_LIMIT => 1000))
WHERE query_tag = 'black-friday' AND execution_status = 'SUCCESS'
GROUP BY 1 ORDER BY 1"""

with snowflake.connector.connect(
        connection_name='shopwave', role='ANALYST', warehouse='WH_BI',
        database='ANALYTICS', schema='MARTS', session_parameters={
            'QUERY_TAG': 'black-friday', 'USE_CACHED_RESULT': False},
        enable_server_session_keep_alive_auto_detection=False) as conn:
    sent = [conn.cursor().execute_async(DASHBOARD)['queryId']
            for _ in range(LOADS)]
    print(f'{len(sent)} dashboard queries sent')
    while any(conn.is_still_running(conn.get_query_status(q)) for q in sent):
        time.sleep(1)
    print('all finished')
    print('cluster  queries  longest wait')
    for cluster, n, wait in conn.cursor().execute(HISTORY):
        print(f'{cluster:>7}  {n:>7}  {wait / 1000:>9.1f} s')
