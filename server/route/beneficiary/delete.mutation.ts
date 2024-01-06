import { UserActivityType } from '@prisma/client'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SecurityRuleContext,
  SecurityRuleGrantee,
} from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'
import { createMutation } from '~/server/route/createRoute'
import { BeneficiaryRelativeRepo, BeneficiaryRepo } from '~/server/database'
import { BeneficiaryService } from '~/server/services'

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
  const permissions = await BeneficiaryService.getUpdatePermission(
    ctx,
    input.id
  )
  return permissions.delete.beneficiary
}

const handler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  await updateBeneficiaryRelatives(user, id)

  await BeneficiaryRepo.prisma.delete({ where: { id } })
}

async function updateBeneficiaryRelatives(
  user: SecurityRuleGrantee,
  linkedBeneficiaryId: string
) {
  const relatives = await BeneficiaryRelativeRepo.findMany(user, {
    where: {
      linkedBeneficiaryId
    },
    include: {
      linkedBeneficiary: true
    }
  })

  if (!relatives?.length) {
    return
  }

  for (const relative of relatives) {
    const { linkedBeneficiary: lb } = relative
    await BeneficiaryRelativeRepo.update(user, {
      data: {
        linkedBeneficiaryId: null,
        email: lb?.email || null,
        firstName: lb?.firstName || null,
        lastName: lb?.usualName || null,
        city: lb?.city || null,
        phone: lb?.phone1 || lb?.phone2 || null
      },
      where: {
        id: relative.id
      }
    })
  }
}

export const deleteBeneficiaryMutation = createMutation({
  inputValidation: idSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.delete',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.DELETE
  }
})
