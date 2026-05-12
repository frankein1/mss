import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { SecurityRuleContext } from '~/server/security'
import type { GetBeneficiaryDetailsInput } from '~/server/schema'
import { getBeneficiaryDetailsSchema } from '~/server/schema'
import { BeneficiaryService, FamilyFileService } from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: GetBeneficiaryDetailsInput
) => {
  const permissions = await BeneficiaryService.getEditionPermissions(
    ctx,
    input.id
  )
  return permissions.view.general
}

const handler = async ({
  input,
  ctx
}: {
  input: GetBeneficiaryDetailsInput
  ctx: ProtectedAppContext
}) => {
  const data = await BeneficiaryService.get({
    ctx,
    id: input.id
  })

  const familyFileId = data.beneficiary.familyFileId

  const familyFileMinimalInfo = await FamilyFileService.getMinimalInfo({
    ctx,
    input: { id: familyFileId }
  })

  const membersAccommodation = input.options?.accommodation
    ? await FamilyFileService.getMembersAccommodation({
        ctx,
        input: { id: familyFileId, beneficiaryId: input.id }
      })
    : []

  return {
    ...data,
    familyFileMinimalInfo,
    membersAccommodation
  }
}

export const getBeneficiaryDetailsQuery = createQuery({
  inputValidation: getBeneficiaryDetailsSchema,
  securityCheck,
  handler
})
