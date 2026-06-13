import type { Prisma, SocialSupportSubject } from '@prisma/client'
import { UserActivityType } from '@prisma/client'
import {
  BeneficiaryRepo,
  FamilyFileRepo,
  FileInstructionRepo,
  FollowupRepo
} from '~/server/database'
import { ArchivedBeneficiaryRepo } from '~/server/database/repository/ArchivedBeneficiaryRepository'
import { createMutation } from '~/server/route'
import type { ExportBeneficiaryInput } from '~/server/schema/beneficiary/exportbeneficiary.schema'
import { exportBeneficiarySchema } from '~/server/schema/beneficiary/exportbeneficiary.schema'
import type { SecurityRuleContext } from '~/server/security'
import type { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { BeneficiaryService, DocumentService } from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: ExportBeneficiaryInput
) => {
  const permission = await BeneficiaryService.getArchivePermissions({
    ctx,
    id: input.beneficiaryId
  })
  return permission.archive
}

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
      id: true,
      created: true,
      title: true,
      usualName: true,
      birthName: true,
      firstName: true,
      structure: {
        select: {
          type: true,
          id: true
        }
      },
      familyFileId: true,
      familyFile: {
        select: {
          id: true,
          beneficiaries: true,
          socialSupports: {
            select: {
              subjects: true
            }
          }
        }
      }
    }
  })

  const where = {
    socialSupport: {
      familyFileId: beneficiary.familyFileId
    }
  }
  const followupCount = await FollowupRepo.count(ctx.user, {
    where
  })
  const filleInstructionCount = await FileInstructionRepo.count(ctx.user, {
    where
  })

  const createArchivedBeneficiary = () =>
    ArchivedBeneficiaryRepo.prisma.create({
      data: {
        oldBeneficiaryId: beneficiary.id,
        fileCreationDate: beneficiary.created,
        socialSupportSubjects: getSocialSupportsSujectsNames(
          beneficiary.familyFile.socialSupports
        ),
        followupCount,
        filleInstructionCount,
        structureType: beneficiary.structure.type,
        archivedById: ctx.user.id,
        structureId: beneficiary.structure.id,
        clarification: input.clarification ? input.clarification : null,
        reason: input.reason ? input.reason : null,
        eventDateReason: input.date ? input.date : null,
        title: input.keepName ? beneficiary.title : null,
        usualName: input.keepName ? beneficiary.usualName : null,
        birthName: input.keepName ? beneficiary.birthName : null,
        firstName: input.keepName ? beneficiary.firstName : null
      }
    })

  const deleteBeneficiary = () =>
    BeneficiaryRepo.prisma.delete({
      where: { id: input.beneficiaryId }
    })

  const deleteFamilyFile = () =>
    FamilyFileRepo.prisma.delete({
      where: { id: beneficiary.familyFileId }
    })

  const transactions: (() => Prisma.PrismaPromise<any>)[] = [
    createArchivedBeneficiary,
    deleteBeneficiary
  ]
  if (beneficiary.familyFile.beneficiaries.length === 1) {
    transactions.push(deleteFamilyFile)
  }

  await prismaClient.$transaction(
    transactions.map(transactions => transactions())
  )

  const config = useRuntimeConfig()
  if (config.document.useS3Storage) {
    DocumentService.deleteBeneficiaryS3Files(config, input.beneficiaryId).catch(e =>
      console.error(
        `archive: failure to delete from S3 for beneficiary ${input.beneficiaryId}`,
        e
      )
    )
  }
}

export const archiveBeneficiaryMutation = createMutation({
  inputValidation: exportBeneficiarySchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.archive',
    target: 'ArchivedBeneficiary',
    targetId: ({ input }) => {
      return input.beneficiaryId
    },
    action: UserActivityType.ARCHIVE
  }
})

const getSocialSupportsSujectsNames = (
  socialSupports: {
    subjects: SocialSupportSubject[]
  }[]
) => {
  const subjects = socialSupports.map(support => support.subjects)
  const names = subjects.map(subject => subject.map(s => s.name)).flat()
  return [...new Set(names)] // remove duplicates
}
