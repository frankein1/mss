import { z } from 'zod'
import {
  saveBeneficiarySchema,
  saveBeneficiaryGeneralInformationSchema,
  saveBeneficiaryTaxHouseholdSchema,
  saveBeneficiaryEntourageSchema,
  saveBeneficiaryHealthSchema
} from './saveBeneficiary.schema'

export const updateBeneficiarySchema = saveBeneficiarySchema.extend({
  id: z.string().uuid(),
  structureId: z.string().uuid()
})

export type UpdateBeneficiaryInput = z.infer<typeof updateBeneficiarySchema>

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
