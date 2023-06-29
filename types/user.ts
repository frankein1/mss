import type { StructureType, User as PrismaUser } from '@prisma/client'

export type JwtUser = Pick<
  PrismaUser,
  'id' | 'lastName' | 'firstName' | 'email' | 'role' | 'status' | 'structureId'
> & {
  structureType?: StructureType
  CGUHistoryVersion: string | null
}

export type JwtData = {
  user: JwtUser
  iat: number
  exp: number
}
