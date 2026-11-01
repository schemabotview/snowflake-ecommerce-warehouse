import type { Course } from '../types'
import { stage } from './01-stage'
import { formats } from './02-formats'
import { copy } from './03-copy'
import { once } from './04-once'
import { validate } from './05-validate'
import { variant } from './06-variant'
import { schemaChange } from './07-schema-change'
import { latin1 } from './08-latin1'
import { snowpipe } from './09-snowpipe'

export const load: Course = {
  id: 'load',
  title: 'Getting data in',
  sections: [stage, formats, copy, once, validate, variant, schemaChange, latin1, snowpipe],
}
