import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  updateSocialSupportSubjectsSchema,
  UpdateSocialSupportSubjectsInput
} from '~/server/schema'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import { StructureRepo } from '~/server/database'

const handler = async ({
  input,
  ctx: { structure }
}: {
  input: UpdateSocialSupportSubjectsInput
  ctx: ProtectedAppContext
}) => {
  const update = input.selected.map(sss => ({
    where: {
      id: sss.id
    },
    data: {
      inactive: !sss.active
    }
  }))
  const create = input.custom.map(sss => ({
    inactive: false,
    name: sss.name,
    legallyRequired: false
  }))
  const res = await StructureRepo.prisma.update({
    where: { id: structure.id },
    data: {
      socialSupportSubjects: {
        update,
        createMany: {
          data: create
        }
      }
    },
    select: {
      id: true
    }
  })

  return res
}

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).edit.structure

export const updateSocialSupportSubjects = createMutation({
  handler,
  inputValidation: updateSocialSupportSubjectsSchema,
  securityCheck
})
