import type { Structure, User } from '@prisma/client'

export type SecurityRuleStructure = Pick<
  Structure,
  'id' | 'type' | 'externalRdvspActive'
>

export type SecurityRuleGrantee = Pick<
  User,
  'id' | 'status' | 'role' | 'structureId'
> & {
  /**
   * Structures qu'un décideur est autorisé à consulter. Renseigné uniquement
   * pour le rôle DecisionMaker, par decisionMakerProcedure, à partir des
   * autorisations de partage en base — jamais depuis une entrée client.
   *
   * Les contraintes s'en servent pour élargir le filtrage à plusieurs
   * structures, là où les autres rôles sont limités à `structureId`.
   */
  authorizedStructureIds?: string[]
}

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
