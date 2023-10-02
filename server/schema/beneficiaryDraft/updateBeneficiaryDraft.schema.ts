import { z } from 'zod'
import {
  saveBeneficiaryGeneralInformationSchema,
  saveBeneficiaryTaxHouseholdSchema,
  saveBeneficiaryEntourageSchema,
  saveBeneficiaryHealthSchema,
  saveBeneficiaryOccupationSchema
} from '../beneficiary'

export const updateBeneficiaryDraftSchema = z.object({
  id: z.string().uuid(),
  general: saveBeneficiaryGeneralInformationSchema.optional(),
  taxHousehold: saveBeneficiaryTaxHouseholdSchema.optional(),
  entourage: saveBeneficiaryEntourageSchema.optional(),
  health: saveBeneficiaryHealthSchema.optional(),
  occupation: saveBeneficiaryOccupationSchema.optional()
  // TODO: Add other sections
})

export type UpdateBeneficiaryDraftInput = z.infer<
  typeof updateBeneficiaryDraftSchema
>
