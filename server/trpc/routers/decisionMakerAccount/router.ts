import { updateMyProfile } from '~~/server/route/decisionMaker/update-profile.mutation'
import { revokeMySharing } from '~~/server/route/decisionMaker/revoke-my-sharing.mutation'
import { getMySharings } from '~~/server/route/decisionMaker/get-my-sharings.query'
import { decisionMakerProcedure, router } from '~~/server/trpc'
import {
  emptySchema,
  revokeMySharingSchema,
  updateDecisionMakerProfileSchema
} from '~~/server/schema'

/**
 * Compte du décideur : ce qu'il peut consulter et modifier sur lui-même.
 *
 * Séparé de `decisionMakerRouter`, qui sert les statistiques et reste
 * volontairement sans aucune mutation.
 */
export const decisionMakerAccountRouter = router({
  getMySharings: decisionMakerProcedure
    .input(emptySchema)
    .query(({ ctx }) => getMySharings(ctx)),
  updateProfile: decisionMakerProcedure
    .input(updateDecisionMakerProfileSchema)
    .mutation(({ ctx, input }) => updateMyProfile(ctx, input)),
  revokeSharing: decisionMakerProcedure
    .input(revokeMySharingSchema)
    .mutation(({ ctx, input }) => revokeMySharing(ctx, input))
})
