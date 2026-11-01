"""The same question from Python, through the connector snow is built on."""
import snowflake.connector

with snowflake.connector.connect(connection_name='shopwave') as conn:
    client, = conn.cursor().execute('SELECT CURRENT_CLIENT()').fetchone()
    print('client:', client)
