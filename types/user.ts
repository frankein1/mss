import { UserRole } from '@prisma/client'
import type { getUsers } from '~~/server/route/user/getUsers.query'

const { Administrator: _, ...otherRoles } = UserRole
export const NonAdminUserRole = otherRoles
export type NonAdminUserRole = keyof typeof NonAdminUserRole

export type { SructureUser } from '~~/server/route/user/get.query'
export type SructureUserList = Awaited<ReturnType<typeof getUsers>>
