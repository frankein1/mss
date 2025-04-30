import { Prisma, UserActivityType } from '@prisma/client'
import { ProtectedAppContext } from '~/server/trpc'
import { SecurityRuleContext } from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'
import { createMutation } from '~/server/route/createRoute'
import { BeneficiaryRepo, FamilyFileRepo } from '~/server/database'
import { BeneficiaryService } from '~/server/services'
import { prismaClient } from '~/server/prisma'

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
  const permissions = await BeneficiaryService.getDeleteDraftPermissions(
    ctx,
    input.id
  )
  return permissions.delete
}

const handler = async ({
  input: { id },
  ctx
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await BeneficiaryRepo.findWithNoDraftCondition(ctx.user, {
    where: { id, draft: true },
    select: {
      familyFileId: true,
      familyFile: {
        select: { beneficiaries: true }
      }
    }
  })
  const deleteBeneficiary = () =>
    BeneficiaryRepo.prisma.delete({
      where: { id, draft: true }
    })
  const deleteFamilyFile = () =>
    FamilyFileRepo.prisma.delete({
      where: { id: beneficiary.familyFileId }
    })

  // do not delete familyFile if there are other beneficiaries
  if (beneficiary.familyFile.beneficiaries.length > 1) {
    await deleteBeneficiary()
    return
  }
  await prismaClient.$transaction([deleteBeneficiary(), deleteFamilyFile()])
}

export const deleteBeneficiaryDraftMutation = createMutation({
  inputValidation: idSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.deleteDraft',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.DELETE
  }
})
