import type { Section } from '../types'

export const clients: Section = {
  id: 'clients',
  title: 'Three clients',
  scene: 'how-clients',
  narration:
    "There are many ways to talk to Snowflake, and they all reach the same place. The terminal asks the same question twice. First the Snowflake command line, snow, which this course uses everywhere: it prints its version, then asks Snowflake which client it is talking to. Then the editor's small Python program, which connects with the Snowflake connector for Python, using the same saved connection, and asks the same thing. Each answer names the driver that sent the query and its version. Look at the side pane. There are three kinds of client on the top row. Snowsight is Snowflake's web interface, where most people start: worksheets, charts and the account's settings in a browser. This course never shows it, because everything it does can be done in S Q L, and a terminal is something we can record and replay. The command line is a Python program, and under the hood it is built on that very Python connector. And the connector is how programs talk to Snowflake: there are equivalents for Java, Go, Node and others. Whatever the client, the request lands at cloud services. It logs the user in, checks the role, plans the query, and only then, if the query needs to compute, hands it to a warehouse. That is why a client never chooses where data lives or how it is read: it only sends S Q L. Which leaves one question for this course: what all of that costs.",
}
