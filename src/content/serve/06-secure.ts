import type { Section } from '../types'

export const secure: Section = {
  id: 'secure',
  title: "Secure views",
  scene: 'serve-secure',
  narration:
    "Brightline, the marketing agency, wants to see how its campaigns perform. Shopwave wants to show it that and nothing more: not the sessions table, not the customers, and not even how the numbers are worked out. The tool for that is a secure view. The editor's model is an ordinary d b t view with two settings in its config. Secure true makes it a secure view. Copy grants true means that when d b t replaces the view, it keeps the grants already on it, which will matter in the next section. The view itself is simple: visits and buying visits per campaign and week, from the session fact, with each campaign's channel. The side pane's diagram lists what a secure view hides. The rows are shown to anyone allowed to select them. The definition is hidden: the S Q L, and the tables behind it. And Snowflake's optimiser is not allowed shortcuts that could reveal rows the view filters out, which can make a secure view slower than an ordinary one. The query file tests it as an analyst. The analyst reads the view, and the second table shows the campaigns, from the run: the newsletter and retargeting each brought over eleven thousand visits. Then the file asks Snowflake to show the view, including its text, and the third table compares the two readers: for the analyst the text is empty, for the transformer, who owns it, the definition is there. Only a secure view can be shared with another Snowflake account, and that is the next step: giving it to Brightline.",
}
