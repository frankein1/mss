import { z } from 'zod'
import { MAX_BENEFICIARIES_REFERENT_TRANSFER } from '~/utils/constants'
import { requiredErrorMessage } from '~/utils/zod'

export const transfertReferentToFamilyFileSchema = z.object({
  familyFileIds: z
    .array(z.string().uuid())
    .max(MAX_BENEFICIARIES_REFERENT_TRANSFER, {
      message: `Pas plus de ${MAX_BENEFICIARIES_REFERENT_TRANSFER} bénéficiaires.`
    })
    .min(1, {
      message: `Veuillez sélectionner au moins 1 bénéficiaire.`
    }),
  referentId: z
    .string({ required_error: requiredErrorMessage })
    .min(1, requiredErrorMessage)
    .uuid()
})

export type TransferReferentToFamilyFileInput = z.infer<
  typeof transfertReferentToFamilyFileSchema
>
