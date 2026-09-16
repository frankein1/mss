import { statisticsSharingRoutes as routes } from '~~/server/route'
import { protectedProcedure, router } from '~~/server/trpc'

/**
 * Côté structure : gestion des autorisations de partage de statistiques.
 * Le côté décideur est servi par decisionMakerRouter, en lecture seule.
 */
export const statisticsSharingRouter = router({
  getForStructure: protectedProcedure
    .input(routes.getStatisticsSharingsForStructureQuery.inputValidation)
    .query(routes.getStatisticsSharingsForStructureQuery.execute),
  invite: protectedProcedure
    .input(routes.inviteDecisionMakerMutation.inputValidation)
    .mutation(routes.inviteDecisionMakerMutation.execute),
  revoke: protectedProcedure
    .input(routes.revokeStatisticsSharingMutation.inputValidation)
    .mutation(routes.revokeStatisticsSharingMutation.execute)
})
