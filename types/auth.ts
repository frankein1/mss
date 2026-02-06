import type { getUserAuthenticatedInfo } from '~/server/api/auth/get-session'
import type { getMSSSession } from '~/server/auth/auth-middleware'

export type UserAuthenticatedInfo = Awaited<
  ReturnType<typeof getUserAuthenticatedInfo>
>

export type UserSession = Awaited<ReturnType<typeof getMSSSession>>
