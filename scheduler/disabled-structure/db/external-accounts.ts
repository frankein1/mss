import { z } from 'zod'
import type { ExternalAccount } from '@prisma/client'
import type { Client } from 'pg'
import { readRows } from '../utils'
import type { SnakeCaseKeys } from '../../utils'

const sourceExternalAccountSchema = z
  .object({
    id: z.string(),
    user_id: z.string(),
    provider: z.string(),
    provider_account_id: z.string(),
    refresh_token: z.string().nullable(),
    access_token: z.string().nullable(),
    expires_at: z.coerce.date().nullable(),
    scope: z.string().nullable(),
    id_token: z.string().nullable(),
    session_state: z.string().nullable(),
    created: z.coerce.date(),
    updated: z.coerce.date()
  })
  .strict()

type SourceExternalAccountRow = z.infer<typeof sourceExternalAccountSchema>

/* Expected column updates to target DB */
export type ExpectedExternalAccountCreate = ExternalAccount

type ExpectedExternalAccountRead = ExpectedExternalAccountCreate & {
  id: string
}

export function mapExternalAccountCreate(
  row: SourceExternalAccountRow
): ExpectedExternalAccountCreate {
  return {
    id: row.id,
    created: row.created,
    updated: row.updated,
    userId: row.user_id,
    provider: row.provider,
    providerAccountId: row.provider_account_id,
    refreshToken: row.refresh_token,
    accessToken: row.access_token,
    expiresAt: row.expires_at,
    scope: row.scope,
    idToken: row.id_token,
    sessionState: row.session_state
  }
}

export async function readExternalAccounts(
  source: Client,
  sourceUsers: { id: string }[]
) {
  const userIds = sourceUsers.map(u => u.id)
  const sourceExternalAccounts = await readRows(
    source,
    `SELECT *
     FROM external_account WHERE user_id = ANY($1)`,
    [userIds],
    sourceExternalAccountSchema
  )
  console.log(
    `restore-structure: ${sourceExternalAccounts.length} external accounts found in source database`
  )

  return sourceExternalAccounts satisfies SnakeCaseKeys<ExpectedExternalAccountRead>[]
}
