import { z } from 'zod'
import { maxStringLengthMessage, minStringLengthMessage } from '~/utils/zod'
import { stringConstraint } from '../helpers.schema'

/**
 * Profil modifiable par un décideur sur son propre compte.
 *
 * L'e-mail en est volontairement absent : il identifie la personne auprès de
 * ProConnect et sert de clé de rattachement à l'invitation. Le champ est grisé
 * côté écran, mais c'est ce schéma qui garantit qu'il ne peut pas être modifié.
 * Les bornes reprennent celles de la création d'utilisateur.
 */
export const updateDecisionMakerProfileSchema = z.object({
  firstName: stringConstraint
    .max(20, maxStringLengthMessage(20))
    .min(2, minStringLengthMessage(2)),
  lastName: stringConstraint
    .max(30, maxStringLengthMessage(30))
    .min(2, minStringLengthMessage(2))
})

export type UpdateDecisionMakerProfileInput = z.infer<
  typeof updateDecisionMakerProfileSchema
>
