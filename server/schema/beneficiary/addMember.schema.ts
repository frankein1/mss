import { z } from 'zod'
import { updateBeneficiaryGeneralInformationSchema } from './updateBeneficiary.schema'

export const addFamilyFileMemberSchema =
  updateBeneficiaryGeneralInformationSchema
    .pick({
      title: true,
      usualName: true,
      firstName: true,
      birthDate: true,
      status: true,
      referents: true
    })
    .merge(
      z.object({
        familyFileId: z.string().uuid(),
        draft: z.boolean().default(false)
      })
    )

export type AddFamilyFileMemberInput = z.infer<typeof addFamilyFileMemberSchema>
