import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { SecurityRuleContext } from '~~/server/security'
import { getAppContextPermissions } from '~~/server/security'
import { emptySchema } from '~~/server/schema'
import { StatisticsSharingRepo } from '~~/server/database'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).edit.structure

/** Autorisations accordées par la structure de l'utilisateur, révoquées incluses */
const handler = async ({ ctx }: { ctx: ProtectedAppContext }) => {
  return StatisticsSharingRepo.findMany(ctx.user, {
    select: {
      id: true,
      createdAt: true,
      expiresAt: true,
      revokedAt: true,
      decisionMaker: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          firstAccess: true,
          structure: { select: { name: true, siret: true } }
        }
      },
      createdBy: { select: { firstName: true, lastName: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export const getStatisticsSharingsForStructureQuery = createQuery({
  inputValidation: emptySchema,
  securityCheck,
  handler
})
