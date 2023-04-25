import type { StructureType, User as PrismaUser } from '@prisma/client'

export type JwtUser = Pick<
  PrismaUser,
  'id' | 'lastName' | 'firstName' | 'email' | 'role'
> & {
  inclusionConnectId: string
  structureId?: string
  structureType?: StructureType
}

export type JwtData = {
  user: JwtUser
  iat: number
  exp: number
}
