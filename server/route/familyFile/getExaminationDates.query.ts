import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import type { IdInput } from '~/server/schema'
import { idSchema } from '~/server/schema'
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
  return permissions.helpRequest.access
}

export const getExaminationDatesQuery = createQuery({
  handler,
  securityCheck,
  inputValidation: idSchema
})
