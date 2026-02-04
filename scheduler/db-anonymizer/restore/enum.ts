import { escapeIdentifier, escapeLiteral } from 'pg'
import type { Client } from 'pg'
import { z } from 'zod'
import { SOURCE_SCHEMA, TARGET_SCHEMA } from '../db'

const sqlCreateEnum = (name: string, values: string[]) =>
  `CREATE TYPE ${escapeIdentifier(TARGET_SCHEMA)}.${escapeIdentifier(name)} AS ENUM (${values.map(escapeLiteral).join(',')})`

/** Create SQL query for enums by introspecting the list of enums defined in the source database */
export async function createSQLQueriesForEnums(source: Client) {
  const querySchema = z.object({
    rows: z.array(z.object({ typname: z.string(), enumlabel: z.string() }))
  })
  const res = await source.query(
    'select typname,e.enumlabel from pg_type t join pg_enum e on t.oid = e.enumtypid join pg_namespace n on t.typnamespace = n.oid where n.nspname = $1;',
    [SOURCE_SCHEMA]
  )

  const validated = querySchema.safeParse(res)
  if (validated.success === false) {
    throw new Error('createSQLQueriesForEnums: wrong schema for request result')
  }

  const enumData = Object.groupBy(validated.data.rows, ({ typname }) => typname)

  const output = Object.entries(enumData)
    .filter(([_, rows]) => Boolean(rows?.length))
    .map(([name, rows]) =>
      sqlCreateEnum(
        name,
        (rows || []).map(r => r.enumlabel)
      )
    )

  return output
}
