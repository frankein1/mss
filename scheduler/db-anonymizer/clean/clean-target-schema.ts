import { escapeIdentifier } from 'pg'
import type { Client } from 'pg'
import { z } from 'zod'
import { isProductionEnvironment, TARGET_SCHEMA } from '../db'

const sqlDropEnum = (name: string) =>
  `DROP TYPE IF EXISTS ${escapeIdentifier(TARGET_SCHEMA)}.${escapeIdentifier(name)} CASCADE`

async function createQueriesForDropEnums(target: Client) {
  const querySchema = z.object({
    rows: z.array(z.object({ typname: z.string() }))
  })

  const res = await target.query(
    'select typname from pg_type t join pg_enum e on t.oid = e.enumtypid join pg_namespace n on t.typnamespace = n.oid where n.nspname = $1 group by typname;',
    [TARGET_SCHEMA]
  )

  const validated = querySchema.safeParse(res)
  if (validated.success === false) {
    throw new Error('dropEnums: wrong schema for request result')
  }

  return validated.data.rows.map(({ typname }) => sqlDropEnum(typname))
}

const sqlDropTable = (name: string) =>
  `DROP TABLE IF EXISTS ${escapeIdentifier(TARGET_SCHEMA)}.${escapeIdentifier(name)} CASCADE`

async function createQueriesForDropTables(target: Client) {
  const querySchema = z.object({
    rows: z.array(
      z.object({
        tablename: z.string()
      })
    )
  })

  const res = await target.query(
    `select tablename from pg_tables where schemaname = $1;`,
    [TARGET_SCHEMA]
  )

  const validated = querySchema.safeParse(res)
  if (validated.success === false) {
    throw new Error('dropTables: wrong schema for request result')
  }

  return validated.data.rows.map(({ tablename }) => sqlDropTable(tablename))
}

export async function cleanTargetSchema(target: Client) {
  // When not on production, use another schema in the same database
  if (!isProductionEnvironment) {
    await target.query(`CREATE SCHEMA IF NOT EXISTS ${TARGET_SCHEMA};`)
  }

  const qtables = await createQueriesForDropTables(target)
  const qenums = await createQueriesForDropEnums(target)
  await target.query(
    `BEGIN;${qtables.join(';\n')};${qenums.join(';\n')};COMMIT;`
  )
}
