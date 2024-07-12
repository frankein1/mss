import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'
import { FileInstructionRepo } from '~/server/database'

const handler = async ({
  input,
  ctx: { user }
}: {
  input: IdInput
  ctx: ProtectedAppContext
}) => {
  const examinationDates = await FileInstructionRepo.findMany(user, {
    where: {
      examinationDate: { not: null },
      socialSupport: { beneficiaryId: input.id }
    },
    select: { examinationDate: true },
    distinct: 'examinationDate',
    orderBy: [{ examinationDate: 'desc' }]
  })

  return examinationDates
}

const securityCheck = (ctx: SecurityRuleContext, _input: IdInput) => {
  const permissions = getAppContextPermissions({
    user: ctx.user,
    structure: ctx.structure
  })
  return permissions.module.helpRequest
}

export const getExaminationDatesQuery = createQuery({
  handler,
  securityCheck,
  inputValidation: idSchema
})
