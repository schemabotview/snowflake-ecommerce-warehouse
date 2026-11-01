import type { Section } from '../types'

export const serviceUsers: Section = {
  id: 'service-users',
  title: "Service users and key pairs",
  scene: 'secure-service-users',
  narration:
    "The loader and d b t are programs, not people, so they get service users, and service users never have a password. They log in with a key pair instead. The editor's script makes one for each. For the loader and for d b t, it generates a private key with open S S L and keeps it in a folder only Ana can read, then writes out the matching public key. The private key never leaves this machine, and nothing secret ever appears on screen. Then it runs the S Q L file beside it, passing the two public keys in. That file creates the two users with type service, which means they may never have a password and no person can sign in with them, gives each its public key and a default role, and grants the roles. The terminal then logs in as each of them, using only the private key, and asks Snowflake who it sees. Look at the side pane to see how a login without a password works. The client uses the private key to sign a short lived token. Snowflake checks the signature against the public key it was given, and if it matches, opens a session as that user, with its role. The table underneath is the run's answer: each service user, with its own role. A stolen password can be typed from anywhere. A key is harder to steal, but not impossible, which is what the last section of this course is about: where a login may come from.",
}
