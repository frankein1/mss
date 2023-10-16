import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { idSchema } from '~/server/schema'
import { BeneficiaryRepo } from '~/server/repository'

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
  securityCheck: AllowSecurityCheck,
  handler
})
