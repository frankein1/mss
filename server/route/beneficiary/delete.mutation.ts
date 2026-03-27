import { UserActivityType } from '@prisma/client'
import type { ProtectedAppContext } from '~/server/trpc'
import type { SecurityRuleContext } from '~/server/security'
import type { IdInput } from '~/server/schema'
import { idSchema } from '~/server/schema'
import { createMutation } from '~/server/route/createRoute'
import { BeneficiaryRepo, FamilyFileRepo } from '~/server/database'
import { BeneficiaryService } from '~/server/services'
import { prismaClient } from '~/server/prisma'
import { deleteAllFilesWithPrefix } from '~/server/lib/s3/file'

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
  const permissions = await BeneficiaryService.getEditionPermissions(
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
  const beneficiary = await BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
    where: { id },
    select: {
      familyFileId: true,
      familyFile: {
        select: { beneficiaries: true }
      }
    }
  })
  const deleteBeneficiary = () =>
    BeneficiaryRepo.prisma.delete({
      where: { id }
    })
  const deleteFamilyFile = () =>
    FamilyFileRepo.prisma.delete({
      where: { id: beneficiary.familyFileId }
    })

  // do not delete familyFile if there are other beneficiaries
  if (beneficiary.familyFile.beneficiaries.length > 1) {
    await deleteBeneficiary()
  } else {
    await prismaClient.$transaction([deleteBeneficiary(), deleteFamilyFile()])
  }

  const config = useRuntimeConfig()
  if (config.document.useS3Storage) {
    deleteAllFilesWithPrefix(config, `${ctx.structure.id}/${id}/`).catch(e =>
      console.error(
        `delete-beneficiary: failure to delete from S3 for beneficiary ${id} and structure id ${ctx.structure.id}`,
        e
      )
    )
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
