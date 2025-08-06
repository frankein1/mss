import { z } from 'zod/v4'
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
    .extend(
      z.object({
                familyFileId: z.uuid(),
                relationship: requiredNativeEnum(RelativeRelationship),
                usualName: beneficiaryLastNameSchema
              }).shape
    )

export type CreateFamilyFileMemberInput = z.infer<
  typeof createFamilyFileMemberSchema
>
