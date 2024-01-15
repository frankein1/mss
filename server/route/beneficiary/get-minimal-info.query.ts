import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { SecurityRuleContext } from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'
import { BeneficiaryRepo } from '~/server/database'
import { BeneficiaryService } from '~/server/services'

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
  const permissions = await BeneficiaryService.getEditionPermission(
    ctx,
    input.id
  )
  return permissions.view.general
}

const handler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await BeneficiaryRepo.findUniqueOrThrow(user, {
    where: { id },
    select: {
      id: true,
      firstName: true,
      usualName: true,
      birthName: true,
      referents: true,
      structureId: true
    }
  })

  const {
    referents: _,
    structureId: __,
    ...beneficiaryMinimalInfo
  } = beneficiary

  return beneficiaryMinimalInfo
}

export const getBeneficiaryMinimalInfoQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
