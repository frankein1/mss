import { z } from 'zod'
import {
  saveBeneficiaryGeneralInformationSchema,
  saveBeneficiaryTaxHouseholdSchema,
  saveBeneficiaryEntourageSchema,
  saveBeneficiaryHealthSchema,
  saveBeneficiaryOccupationSchema,
  saveBeneficiaryExternalOrganisationsSchema
} from './saveBeneficiary.schema'

export const updateBeneficiaryGeneralInformationSchema =
  saveBeneficiaryGeneralInformationSchema.extend({
    id: z.string().uuid(),
    structureId: z.string().uuid()
  })

export type UpdateBeneficiaryGeneralInformationInput = z.infer<
  typeof updateBeneficiaryGeneralInformationSchema
>

export const updateBeneficiaryTaxHouseholdSchema =
  saveBeneficiaryTaxHouseholdSchema.extend({
    id: z.string().uuid()
  })

export type UpdateBeneficiaryTaxHouseholdInput = z.infer<
  typeof updateBeneficiaryTaxHouseholdSchema
>

export const updateBeneficiaryEntourageSchema =
  saveBeneficiaryEntourageSchema.extend({
    id: z.string().uuid()
  })

export type UpdateBeneficiaryEntourageInput = z.infer<
  typeof updateBeneficiaryEntourageSchema
>

export const updateBeneficiaryHealthSchema = saveBeneficiaryHealthSchema.extend(
  {
    id: z.string().uuid()
  }
)

export type UpdateBeneficiaryHealthInput = z.infer<
  typeof updateBeneficiaryHealthSchema
>

export const updateBeneficiaryOccupationSchema =
  saveBeneficiaryOccupationSchema.extend({
    id: z.string().uuid()
  })

export type UpdateBeneficiaryOccupationInput = z.infer<
  typeof updateBeneficiaryOccupationSchema
>

export const updateBeneficiaryExternalOrganisationsSchema =
  saveBeneficiaryExternalOrganisationsSchema.extend({
    id: z.string().uuid()
  })

export type UpdateBeneficiaryExternalOrganisationsInput = z.infer<
  typeof updateBeneficiaryExternalOrganisationsSchema
>
