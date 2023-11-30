import { Structure, User } from '@prisma/client'

export type StructureFormType = Pick<
  Structure,
  | 'id'
  | 'city'
  | 'zipcode'
  | 'type'
  | 'inhabitantsNumber'
  | 'inseeCode'
  | 'siret'
  | 'name'
  | 'address'
  | 'phone'
  | 'email'
>

export type UserStructureType = Pick<
  User,
  | 'id'
  | 'lastName'
  | 'firstName'
  | 'email'
  | 'aidantConnectAuthorisation'
  | 'role'
  | 'status'
>
