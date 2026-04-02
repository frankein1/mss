import { z } from 'zod'
import type { Account } from '@prisma/client'
import type { Client } from 'pg'
import { readRows } from '../utils'
import type { SnakeCaseKeys } from '../../utils'

const sourceAccountSchema = z
  .object({
    id: z.string(),
    user_id: z.string(),
    type: z.string(),
    provider: z.string(),
    provider_account_id: z.string(),
    refresh_token: z.string().nullable(),
    access_token: z.string().nullable(),
    expires_at: z.number().nullable(),
    token_type: z.string().nullable(),
    scope: z.string().nullable(),
    id_token: z.string().nullable(),
    session_state: z.string().nullable(),
    created: z.coerce.date().nullable(),
    updated: z.coerce.date().nullable()
  })
  .strict()

type SourceAccountRow = z.infer<typeof sourceAccountSchema>

/* Expected column updates to target DB */
export type ExpectedAccountCreate = Account

type ExpectedAccountRead = ExpectedAccountCreate & { id: string }

export function mapAccountCreate(row: SourceAccountRow): ExpectedAccountCreate {
  return {
    id: row.id,
    created: row.created,
    updated: row.updated,
    userId: row.user_id,
    type: row.type,
    provider: row.provider,
    providerAccountId: row.provider_account_id,
    refreshToken: row.refresh_token,
    accessToken: row.access_token,
    expiresAt: row.expires_at,
    tokenType: row.token_type,
    scope: row.scope,
    idToken: row.id_token,
    sessionState: row.session_state
  }
}

export async function readAccounts(
  source: Client,
  sourceUsers: { id: string }[]
) {
  const userIds = sourceUsers.map(u => u.id)
  const sourceAccounts = await readRows(
    source,
    `SELECT *
       FROM account WHERE user_id = ANY($1)`,
    [userIds],
    sourceAccountSchema
  )
  console.log(
    `restore-structure: ${sourceAccounts.length} accounts  found in source database`
  )

  return sourceAccounts satisfies SnakeCaseKeys<ExpectedAccountRead>[]
}
