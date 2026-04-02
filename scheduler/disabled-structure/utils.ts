import { Client } from 'pg'
import { prismaClient } from '~/server/prisma'
import { z } from 'zod'
import type { ZodSchema } from 'zod'

export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

export function parseArgs() {
  const args = process.argv.slice(2)
  const structureId = args.find(a => !a.startsWith('--'))
  const dryRun = args.includes('--dry-run')

  if (!structureId) {
    throw new Error(
      'restore-structure: Usage: tsx scheduler/restore-structure/<phase>.ts <structure-id> [--dry-run]'
    )
  }

  const parsed = z.string().uuid().safeParse(structureId)
  if (!parsed.success) {
    throw new Error(
      `restore-structure: Invalid structure ID format: ${structureId}`
    )
  }

  return { structureId, dryRun }
}

export async function createSourceClient(): Promise<Client> {
  const backupUrl = process.env.SOURCE_DATABASE_URL
  if (!backupUrl) {
    throw new Error(
      'restore-structure: Missing SOURCE_DATABASE_URL environment variable'
    )
  }

  const client = new Client({ connectionString: backupUrl })
  await client.connect()
  return client
}

export type SourceClient = Awaited<ReturnType<typeof createSourceClient>>

export async function readRows<T>(
  client: Client,
  sql: string,
  params: unknown[],
  schema: ZodSchema<T>
): Promise<T[]> {
  const result = await client.query(sql, params)

  return result.rows.map((row, index) => {
    const parsed = schema.safeParse(row)
    if (!parsed.success) {
      throw new Error(
        `restore-structure: Row ${index} validation failed: ${parsed.error.message}`
      )
    }
    return parsed.data
  })
}

export function log(step: string, count: number) {
  console.log(
    `restore-structure: [${new Date().toISOString()}] ${step}: ${count} row(s)`
  )
}

export async function validateStructure(source: Client, structureId: string) {
  const [sourceStructure] = await readRows(
    source,
    `SELECT id, name, disabled FROM structure WHERE id = $1`,
    [structureId],
    z.object({ id: z.string(), name: z.string(), disabled: z.boolean() })
  )
  if (!sourceStructure) {
    throw new Error(
      `restore-structure: structure ${structureId} not found in source database`
    )
  }
  console.log(
    `restore-structure: source structure found: "${sourceStructure.name}"`
  )

  const prodStructure = await prismaClient.structure.findUnique({
    where: { id: structureId },
    select: { id: true, disabled: true, name: true }
  })
  if (!prodStructure) {
    throw new Error(
      `restore-structure: structure ${structureId} not found in production database`
    )
  }
  console.log(
    `restore-structure: production structure found: disabled=${prodStructure.disabled}, name="${prodStructure.name}"\n`
  )

  return { sourceStructure, prodStructure }
}
