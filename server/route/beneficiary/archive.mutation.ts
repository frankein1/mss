import { UserActivityType } from '@prisma/client'
import { BeneficiaryRepo, FamilyFileRepo } from '~/server/database'
import { ArchivedBeneficiaryRepo } from '~/server/database/repository/ArchivedBeneficiaryRepository'
import { createMutation } from '~/server/route'
import {
  ExportBeneficiaryInput,
  exportBeneficiarySchema
} from '~/server/schema/beneficiary/exportbeneficiary.schema'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { FamilyFileService } from '~/server/services'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).export.beneficiaries

const handler = async ({
  input,
  ctx
}: {
  input: ExportBeneficiaryInput
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.beneficiaryId },
    select: {
      title: true,
      usualName: true,
      birthName: true,
      firstName: true,
      familyFileId: true,
      familyFile: {
        select: {
          id: true,
          beneficiaries: true
        }
      }
    }
  })

  const createArchivedBeneficiary = ArchivedBeneficiaryRepo.prisma.create({
    data: {
      oldBeneficiaryId: input.beneficiaryId,
      archivedById: ctx.user.id,
      clarification: input.clarification ? input.clarification : null,
      reason: input.reason ? input.reason : null,
      eventDateReason: input.date ? input.date : null,
      title: input.keepName ? beneficiary.title : null,
      usualName: input.keepName ? beneficiary.usualName : null,
      birthName: input.keepName ? beneficiary.birthName : null,
      firstName: input.keepName ? beneficiary.firstName : null
    }
  })

  const deleteBeneficiary = BeneficiaryRepo.prisma.delete({
    where: { id: input.beneficiaryId }
  })

  const deleteFamilyFile = FamilyFileRepo.prisma.delete({
    where: { id: beneficiary.familyFileId }
  })

  const transactions: any[] = [createArchivedBeneficiary, deleteBeneficiary]

  if (beneficiary.familyFile.beneficiaries.length === 1) {
    transactions.push(deleteFamilyFile)
  }

  await prismaClient.$transaction(transactions)
}

export const archiveBeneficiaryMutation = createMutation({
  inputValidation: exportBeneficiarySchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.archived',
    target: 'ArchivedBeneficiary',
    targetId: ({ ctx }) => {
      return ctx.user.id
    },
    action: UserActivityType.ARCHIVE
  }
})
