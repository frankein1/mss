import { UserRole } from '@prisma/client'

const { Administrator: _, ...otherRoles } = UserRole
export const NonAdminUserRole = otherRoles
export type NonAdminUserRole = keyof typeof NonAdminUserRole
