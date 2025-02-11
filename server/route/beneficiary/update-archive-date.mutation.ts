import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { SecurityRuleContext } from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { updateBeneficiaryArchiveDate } from '~/server/schema'
import { BeneficiaryService } from '~/server/services'
import { BeneficiaryRepo } from '~/server/database'
import dayjs from 'dayjs'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: {
    id: string
  }
) => {
  const permissions = await BeneficiaryService.getEditionPermissions(
    ctx,
    input.id
  )
  return permissions.edit.relatives
}

const handler = async ({
  input,
  ctx
}: {
  input: {
    id: string
  }
  ctx: ProtectedAppContext
}) => {
  const data = await prepareData(ctx, input.id)
  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id: input.id },
    data: data
  })
  return updatedBeneficiary
}

export const updateArchiveDateMutation = createMutation({
  inputValidation: updateBeneficiaryArchiveDate,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.updateArchiveDate',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})

const prepareData = async (ctx: SecurityRuleContext, beneficiaryId: string) => {
  const beneficiary = await BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
    where: { id: beneficiaryId },
    select: { archiveDueDate: true, updated: true }
  })
  if (!beneficiary.archiveDueDate) {
    return {
      archiveDueDate: dayjs().add(1, 'year').toDate(),
      updated: beneficiary.updated // ne modifie pas la date de dernière mise à jour
    }
  }
  return {
    updated: beneficiary.updated, // ne modifie pas la date de dernière mise à jour
    archiveDueDate: dayjs().add(1, 'year').toDate(),
    archiveDueDateHistory: {
      push: beneficiary.archiveDueDate
    }
  }
}
