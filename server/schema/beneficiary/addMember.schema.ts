import { z } from 'zod'
import { RelativeRelationship } from '@prisma/client'
import { requiredNativeEnum } from '../helpers.schema'
import { updateBeneficiaryGeneralInformationSchema } from './updateBeneficiary.schema'
import { beneficiaryLastNameSchema } from './beneficiaryLastName.schema'

export const createFamilyFileMemberSchema =
  updateBeneficiaryGeneralInformationSchema
    .pick({
      title: true,
      firstName: true,
      birthDate: true
    })
    .merge(
      z.object({
        familyFileId: z.string().uuid(),
        relationship: requiredNativeEnum(RelativeRelationship),
        usualName: beneficiaryLastNameSchema
      })
    )

export type CreateFamilyFileMemberInput = z.infer<
  typeof createFamilyFileMemberSchema
>
