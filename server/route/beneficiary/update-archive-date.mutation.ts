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
  input
}: {
  input: {
    id: string
  }
  ctx: ProtectedAppContext
}) => {
  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id: input.id },
    data: {
      archiveDueDate: dayjs().add(1, 'year').toDate()
    }
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
