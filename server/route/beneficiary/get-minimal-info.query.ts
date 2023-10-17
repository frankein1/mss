import { createQuery } from '~/server/route'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { canViewBeneficiary } from '~/server/security/rules'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { idSchema } from '~/server/schema'
import { BeneficiaryRepo } from '~/server/database'

const securityCheck = AllowSecurityCheck

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

  if (!canViewBeneficiary(user, beneficiary)) {
    throw forbiddenError()
  }

  return beneficiaryMinimalInfo
}

export const getBeneficiaryMinimalInfoQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
