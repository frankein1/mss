import { z } from 'zod'
import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'

import { AllowSecurityCheck } from '~/server/security/rules/types'
import { BeneficiaryService } from '~/server/services'

// TODO(foyer): SHOULD BE DELETED
const handler = async ({
  input,
  ctx: _ctx
}: {
  input: {
    familyFileId?: string
  }

  ctx: ProtectedAppContext
}) => {
  return await BeneficiaryService.getIdFromFamilyFileId(
    input.familyFileId || ''
  )
}

export const getBeneficiaryId = createQuery({
  handler,
  securityCheck: AllowSecurityCheck,
  inputValidation: z.object({
    familyFileId: z.string().uuid().optional()
  })
})
