import { z } from 'zod'
import {
  saveBeneficiaryGeneralInformationSchema,
  saveBeneficiaryTaxHouseholdSchema,
  saveBeneficiaryEntourageSchema
} from '../beneficiary'

export const updateBeneficiaryDraftSchema = z.object({
  id: z.string().uuid(),
  general: saveBeneficiaryGeneralInformationSchema.optional(),
  taxHousehold: saveBeneficiaryTaxHouseholdSchema.optional(),
  entourage: saveBeneficiaryEntourageSchema.optional()
  // TODO: Add other sections
})

export type UpdateBeneficiaryDraftInput = z.infer<
  typeof updateBeneficiaryDraftSchema
>
