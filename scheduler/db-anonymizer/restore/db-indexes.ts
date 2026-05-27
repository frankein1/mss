import { escapeIdentifier, type Client } from 'pg'
import { z } from 'zod'
import { SOURCE_SCHEMA, TARGET_SCHEMA } from '../db'
import { includeTable } from '../utils'

/** Index definition can be directly applied. Only schema name needs to be updated */
const sqlCreateIndex = (row: { indexdef: string }) =>
  row.indexdef.replaceAll(`ON ${SOURCE_SCHEMA}.`, `ON ${TARGET_SCHEMA}.`)

export async function createSQLQueriesForIndexes(source: Client) {
  const querySchema = z.object({
    rows: z.array(
      z.object({
        tablename: z.string(),
        indexdef: z.string()
      })
    )
  })

  // Filter on PRIMARY KEY
  // HYPOTHESIS, no PII are indexed
  const res = await source.query(
    'SELECT tablename,indexdef FROM pg_indexes join pg_constraint pc on indexname = pc.conname where schemaname = $1',
    [SOURCE_SCHEMA]
  )

  const validated = querySchema.safeParse(res)
  if (validated.success === false) {
    throw new Error(
      'createSQLQueriesForIndexes: wrong schema for request result'
    )
  }

  const output = validated.data.rows
    .filter(({ tablename }) => includeTable(tablename))
    .map(sqlCreateIndex)

  return output
}

const sqlCreateForeignKey = (row: {
  tablename: string
  conname: string
  condef: string
}) => {
  // Adapt the foreign key definition to use the table in the target schema:
  // FOREIGN KEY (<column>) REFERENCES "<table>"(<target_column>) --> FOREIGN KEY (<column>) REFERENCES "<TARGET_SCHEMA>"."<table>"(<target_column>)
  const targetSchemaConstraintDef = row.condef.replace(
    'REFERENCES ',
    `REFERENCES "${escapeIdentifier(TARGET_SCHEMA)}".`
  )
  return `ALTER TABLE ${escapeIdentifier(TARGET_SCHEMA)}.${escapeIdentifier(row.tablename)} ADD CONSTRAINT ${escapeIdentifier(row.conname)} ${targetSchemaConstraintDef}`
}

export async function createSQLQueriesForForeignKeys(source: Client) {
  const querySchema = z.object({
    rows: z.array(
      z.object({
        tablename: z.string(),
        conname: z.string(),
        condef: z.string()
      })
    )
  })

  // Filter on  FOREIGN KEY
  // HYPOTHESIS, no PII are indexed
  const res = await source.query(
    "SELECT pc.conrelid::regclass as tablename,pc.conname,pg_get_constraintdef(pc.oid) as condef FROM pg_constraint pc JOIN pg_catalog.pg_namespace nsp ON nsp.oid = pc.connamespace where nsp.nspname = $1 and pc.contype = 'f'",
    [SOURCE_SCHEMA]
  )

  const validated = querySchema.safeParse(res)
  if (validated.success === false) {
    throw new Error(
      'createSQLQueriesForForeignKeys: wrong schema for request result'
    )
  }

  const output = validated.data.rows
    .filter(({ tablename }) => includeTable(tablename))
    .map(sqlCreateForeignKey)

  return output
}
