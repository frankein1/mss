import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { SecurityRuleContext } from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'
import { BeneficiaryService, FamilyFileService } from '~/server/services'

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
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
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const data = await BeneficiaryService.get({
    ctx,
    id: input.id
  })

  const familyFileMinimalInfo = await FamilyFileService.getMinimalInfo({
    ctx,
    input: { id: data.beneficiary.familyFileId }
  })

  return {
    ...data,
    familyFileMinimalInfo
  }
}

export const getBeneficiaryDetailsQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
