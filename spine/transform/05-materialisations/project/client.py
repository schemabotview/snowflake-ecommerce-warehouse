"""The same question from Python, through the connector snow is built on."""
import snowflake.connector

with snowflake.connector.connect(
        connection_name='shopwave',
        # what happens to running queries at logout: there are none here
        enable_server_session_keep_alive_auto_detection=False) as conn:
    client, = conn.cursor().execute('SELECT CURRENT_CLIENT()').fetchone()
    print('client:', client)
