import { z } from 'zod'
import type { User } from '@prisma/client'
import type { Client } from 'pg'
import { readRows, type Overwrite } from '../utils'
import type { SnakeCaseKeys } from '../../utils'

export const sourceUserSchema = z
  .object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    status: z.string(),
    aidant_connect_authorisation: z.boolean().nullable(),
    external_rdvsp_id: z.string().nullable(),
    authorization_code: z.string().nullable(),
    authorization_code_validity: z.coerce.date().nullable(),
    account_reminder_email: z.number().nullable()
  })
  .strict()

type SourceUserRow = z.infer<typeof sourceUserSchema>

/* Expected column updates to target DB */
export type ExpectedUserUpdate = Omit<
  User,
  | 'id'
  | 'structureId'
  | 'role'
  | 'firstAccess'
  | 'lastAccess'
  | 'created'
  | 'updated'
>
/**
 * Intermediary type for expected user read from DB:
 * - without prisma enum typing
 * - with id column to build the query for updates
 */
type ExpectedUserRead = Overwrite<ExpectedUserUpdate, { status: string }> & {
  id: string
}

export function mapUserUpdate(row: SourceUserRow): ExpectedUserUpdate {
  return {
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    status: row.status as User['status'],
    aidantConnectAuthorisation: row.aidant_connect_authorisation,
    externalRdvspId: row.external_rdvsp_id,
    authorizationCode: row.authorization_code,
    authorizationCodeValidity: row.authorization_code_validity,
    accountReminderEmail: row.account_reminder_email
  }
}

export async function readUsers(source: Client, structureId: string) {
  const sourceUsers = await readRows(
    source,
    `SELECT id, first_name, last_name, email, status,
            aidant_connect_authorisation, external_rdvsp_id,
            authorization_code, authorization_code_validity,
            account_reminder_email
     FROM "public"."user" WHERE structure_id = $1`,
    [structureId],
    sourceUserSchema
  )

  console.log(
    `restore-structure: ${sourceUsers.length} users  found in source database`
  )

  return sourceUsers satisfies SnakeCaseKeys<ExpectedUserRead>[]
}
