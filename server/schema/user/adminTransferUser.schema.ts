import { z } from 'zod'
import { nonAdminUserRoleSchema, requiredUuid } from '../helpers.schema'
import { errorMessages } from '~/utils/zod'
import { VALIDATION_CODE_LENGTH } from '~~/server/utils/constants'

const adminTransferUserBaseSchema = z.object({
  userId: requiredUuid,
  newStructureId: requiredUuid,
  newRole: nonAdminUserRoleSchema
})

const adminTransferUserSchema = adminTransferUserBaseSchema.extend({
  confirmationCode: z.string(errorMessages).length(VALIDATION_CODE_LENGTH, {
    message: `Le code de confirmation doit contenir ${VALIDATION_CODE_LENGTH} chiffres`
  })
})

type AdminTransferUserInput = z.infer<typeof adminTransferUserSchema>

export { adminTransferUserSchema }

export type { AdminTransferUserInput }
