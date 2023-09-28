import { z } from 'zod'
import {
  saveBeneficiarySchema,
  saveBeneficiaryGeneralInformationSchema,
  saveBeneficiaryTaxHouseholdSchema,
  saveBeneficiaryEntourageSchema
} from './saveBeneficiary.schema'

function fromSaveSchemaToUpdateSchema<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
) {
  return schema.extend({
    id: z.string().uuid(),
    structureId: z.string().uuid()
  })
}

export const updateBeneficiarySchema = fromSaveSchemaToUpdateSchema(
  saveBeneficiarySchema
)

export type UpdateBeneficiaryInput = z.infer<typeof updateBeneficiarySchema>

export const updateBeneficiaryGeneralInformationSchema =
  fromSaveSchemaToUpdateSchema(saveBeneficiaryGeneralInformationSchema)

export type UpdateBeneficiaryGeneralInformationInput = z.infer<
  typeof updateBeneficiaryGeneralInformationSchema
>

export const updateBeneficiaryTaxHouseholdSchema = fromSaveSchemaToUpdateSchema(
  saveBeneficiaryTaxHouseholdSchema
)

export type UpdateBeneficiaryTaxHouseholdInput = z.infer<
  typeof updateBeneficiaryTaxHouseholdSchema
>

export const updateBeneficiaryEntourageSchema = fromSaveSchemaToUpdateSchema(
  saveBeneficiaryEntourageSchema
)

export type UpdateBeneficiaryEntourageInput = z.infer<
  typeof updateBeneficiaryEntourageSchema
>
