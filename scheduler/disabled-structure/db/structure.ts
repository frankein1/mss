import { z } from 'zod'
import type { Structure } from '@prisma/client'
import type { Client } from 'pg'
import { readRows } from '../utils'
import type { SnakeCaseKeys } from '../../utils'

/* Validate the structure schema read from the db */
export const sourceStructureSchema = z
  .object({
    name: z.string(),
    address: z.string(),
    phone: z.string(),
    email: z.string(),
    dpo_first_name: z.string().nullable(),
    dpo_last_name: z.string().nullable(),
    dpo_email: z.string().nullable(),
    external_rdvsp_active: z.boolean().nullable(),
    external_rdvsp_id: z.string().nullable()
  })
  .strict()

type SourceStructureRow = z.infer<typeof sourceStructureSchema>

/* Expected column updates from DB */
export type ExpectedStructureUpdate = Omit<
  Structure,
  | 'id'
  | 'type'
  | 'zipcode'
  | 'city'
  | 'inhabitantsNumber'
  | 'inseeCode'
  | 'siret'
  | 'created'
  | 'updated'
  | 'disabled'
  | 'deactivationAlertEmail'
  | 'deactivationAlertEmailDate'
  | 'lastActivity'
  | 'lastAccess'
>

export function mapStructureUpdate(
  row: SourceStructureRow
): ExpectedStructureUpdate {
  return {
    name: row.name,
    address: row.address,
    phone: row.phone,
    email: row.email,
    dpoFirstName: row.dpo_first_name,
    dpoLastName: row.dpo_last_name,
    dpoEmail: row.dpo_email,
    externalRdvspActive: row.external_rdvsp_active,
    externalRdvspId: row.external_rdvsp_id
  }
}

export async function readStructure(source: Client, structureId: string) {
  const [sourceStructure] = await readRows(
    source,
    `SELECT name, address, phone, email, dpo_first_name, dpo_last_name, dpo_email,
              external_rdvsp_active, external_rdvsp_id
       FROM structure WHERE id = $1`,
    [structureId],
    sourceStructureSchema
  )

  if (!sourceStructure) {
    throw new Error(
      `restore-structure: Structure ${structureId} not found in source database`
    )
  }
  return sourceStructure satisfies SnakeCaseKeys<ExpectedStructureUpdate>
}
