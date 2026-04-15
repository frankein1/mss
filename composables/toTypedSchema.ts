/**
 * Shim to expose toTypedSchema from @vee-validate/zod with types that accept
 * zod v4 schemas (imported from 'zod/v4') during the migration.
 * Once zod is bumped to ^4 and imports revert to 'zod', this file can be removed.
 */
import {
  toTypedSchema as _toTypedSchema,
  type ParseParams
} from '@vee-validate/zod'
import type { ZodType } from 'zod/v4'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toTypedSchema = <T extends ZodType<any, any>>(
  schema: T,
  opts?: Partial<ParseParams>
) => _toTypedSchema(schema as any, opts)
