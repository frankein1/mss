import {
  getAuthorizedStructures,
  getDistributionStats,
  getFileInstructionStats,
  getFollowupStats,
  getSocialSupportSubjectNames,
  getMyOrganisation,
  getOverviewStats,
  getWorkshopStats
} from '~~/server/route/decisionMaker/queries'
import { decisionMakerProcedure, router } from '~~/server/trpc'
import { emptySchema, statFilterSchema } from '~~/server/schema'

/**
 * Tableau de bord décideur.
 *
 * Ce routeur ne contient que des `query` : la lecture seule est garantie par
 * le câblage, pas par une règle qu'il faudrait se rappeler. Ne jamais y
 * ajouter de `mutation`.
 */
export const decisionMakerRouter = router({
  getAuthorizedStructures: decisionMakerProcedure
    .input(emptySchema)
    .query(({ ctx }) => getAuthorizedStructures(ctx)),
  getMyOrganisation: decisionMakerProcedure
    .input(emptySchema)
    .query(({ ctx }) => getMyOrganisation(ctx)),
  getOverviewStats: decisionMakerProcedure
    .input(statFilterSchema)
    .query(({ ctx, input }) => getOverviewStats(ctx, input)),
  getDistributionStats: decisionMakerProcedure
    .input(statFilterSchema)
    .query(({ ctx, input }) => getDistributionStats(ctx, input)),
  getFileInstructionStats: decisionMakerProcedure
    .input(statFilterSchema)
    .query(({ ctx, input }) => getFileInstructionStats(ctx, input)),
  getWorkshopStats: decisionMakerProcedure
    .input(statFilterSchema)
    .query(({ ctx, input }) => getWorkshopStats(ctx, input)),
  getFollowupStats: decisionMakerProcedure
    .input(statFilterSchema)
    .query(({ ctx, input }) => getFollowupStats(ctx, input)),
  getSocialSupportSubjectNames: decisionMakerProcedure
    .input(emptySchema)
    .query(({ ctx }) => getSocialSupportSubjectNames(ctx))
})
