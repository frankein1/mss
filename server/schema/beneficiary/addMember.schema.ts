import { z } from 'zod'
import { RelativeRelationship } from '@prisma/client'
import { withEmptyValueOptionalNativeEnum } from '../helpers.schema'
import { updateBeneficiaryGeneralInformationSchema } from './updateBeneficiary.schema'

export const addFamilyFileMemberSchema =
  updateBeneficiaryGeneralInformationSchema
    .pick({
      title: true,
      usualName: true,
      firstName: true,
      birthDate: true,
      referents: true
    })
    .merge(
      z.object({
        familyFileId: z.string().uuid(),
        relationship: withEmptyValueOptionalNativeEnum(RelativeRelationship)
      })
    )

export type AddFamilyFileMemberInput = z.infer<typeof addFamilyFileMemberSchema>
