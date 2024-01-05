import { Structure, User, UserRole } from '@prisma/client'

export type SecurityRuleStructure = Pick<Structure, 'id' | 'type'>

export type SecurityRuleGrantee = Pick<
  User,
  'id' | 'status' | 'role' | 'structureId'
>

export type SecurityRuleContext = {
  user: SecurityRuleGrantee
  structure: SecurityRuleStructure
}

export type SecurityTargetWithStructure = {
  structureId: string | null
}

export type SecurityTargetWithReferents =
  | {
      referents: { id: string }[]
    }
  | { referents: string[] }

// Helper type to safely type an array with at least one UserRole
export type AllowedRoles =
  | [UserRole]
  | [UserRole, UserRole]
  | [UserRole, UserRole, UserRole]
  | [UserRole, UserRole, UserRole, UserRole]
  | [UserRole, UserRole, UserRole, UserRole, UserRole]
  | [UserRole, UserRole, UserRole, UserRole, UserRole, UserRole]

export type SecurityTargetWithCreator =
  | {
      createdById: string | null
    }
  | { createdBy: { id: string } | null }

export type SecurityRule<Input = unknown> = (
  ctx: SecurityRuleContext,
  input: Input
) => boolean | Promise<Boolean>

export const AllowSecurityCheck = (_ctx: SecurityRuleContext, _input: any) => {
  return true
}
