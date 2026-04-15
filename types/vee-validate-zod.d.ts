/**
 * Module augmentation to allow @vee-validate/zod's toTypedSchema to accept
 * zod v4 schemas (from 'zod/v4') during the migration to zod v4.
 * Once zod is bumped to ^4 and imports revert to 'zod', this file can be removed.
 */
import type { ZodType } from 'zod/v4'
import type { TypedSchema } from 'vee-validate'

declare module '@vee-validate/zod' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function toTypedSchema<TSchema extends ZodType<any, any>>(
    zodSchema: TSchema
  ): TypedSchema
}
