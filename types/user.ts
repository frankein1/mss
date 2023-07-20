import { StructureType, User as PrismaUser, UserRole } from '@prisma/client'

export type JwtUser = Pick<
  PrismaUser,
  'id' | 'lastName' | 'firstName' | 'email' | 'role' | 'status' | 'structureId'
> & {
  structureType: StructureType | null
  CGUHistoryVersion: string | null
}

export type JwtData = {
  user: JwtUser
  iat: number
  exp: number
}

const { Administrator: _, ...otherRoles } = UserRole
export const NonAdminUserRole = otherRoles
export type NonAdminUserRole = keyof typeof NonAdminUserRole
