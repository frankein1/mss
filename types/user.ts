import { UserRole } from '@prisma/client'
import type { getUsers } from '~~/server/route/user/getUsers.query'

/**
 * Rôles qu'une structure peut attribuer à ses propres membres.
 *
 * Administrator et DecisionMaker en sont exclus : ils ne sont créés que par
 * l'équipe MSS depuis l'espace d'administration. Cette liste sert aussi de
 * validation à la création d'utilisateur (server/schema/user/user.schema.ts),
 * donc y ajouter un rôle revient à autoriser les structures à l'attribuer.
 */
const {
  Administrator: _admin,
  DecisionMaker: _decisionMaker,
  ...structureRoles
} = UserRole
export const NonAdminUserRole = structureRoles
export type NonAdminUserRole = keyof typeof NonAdminUserRole

export type { SructureUser } from '~~/server/route/user/get.query'
export type SructureUserList = Awaited<ReturnType<typeof getUsers>>
