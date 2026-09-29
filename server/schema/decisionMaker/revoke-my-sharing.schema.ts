import { z } from 'zod'
import { errorMessages } from '~/utils/zod'

/**
 * Renoncement d'un décideur à une autorisation de partage.
 *
 * Seul l'identifiant de l'autorisation est transmis : la structure concernée
 * est relue en base, pour que le journal d'activité ne dépende pas du client.
 */
export const revokeMySharingSchema = z.object({
  sharingId: z.string(errorMessages).uuid()
})

export type RevokeMySharingInput = z.infer<typeof revokeMySharingSchema>
