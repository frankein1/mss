import { z } from 'zod'
import {
  saveBeneficiarySchema,
  saveBeneficiaryGeneralInformationSchema
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
