import { z } from 'zod'
import { createQuery } from '~/server/route'
import { FamilyFileRepo } from '~/server/database'
import { FamilyFileService } from '~/server/services'
import type { ProtectedAppContext } from '~/server/trpc'

const inputValidation = z.object({
  familyFileId: z.string().uuid()
})

type Input = z.infer<typeof inputValidation>

const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: Input
}) => {
  const familyFile = await FamilyFileRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.familyFileId },
    select: {
      beneficiaries: {
        select: {
          supportPrograms: {
            select: {
              supportProgramName: { select: { name: true } }
            }
          }
        }
      }
    }
  })

  const names = new Set<string>()
  for (const beneficiary of familyFile.beneficiaries) {
    for (const supportProgram of beneficiary.supportPrograms) {
      names.add(supportProgram.supportProgramName.name)
    }
  }

  return Array.from(names).sort()
}

export const getSupportProgramNamesForFamilyFileQuery = createQuery({
  inputValidation,
  securityCheck: async (ctx, input) => {
    const permissions = await FamilyFileService.getEditionPermissions(
      ctx,
      input.familyFileId
    )
    return permissions.view.history
  },
  handler
})
