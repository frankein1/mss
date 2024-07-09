import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'
import { FileInstructionRepo } from '~/server/database'

function hasDefinedExaminationDate(h: {
  examinationDate: Date | null
}): h is { examinationDate: Date } {
  return h.examinationDate !== null
}

const handler = async ({ ctx: { user } }: { ctx: ProtectedAppContext }) => {
  const examinationDates = await FileInstructionRepo.findMany(user, {
    where: {
      examinationDate: { not: null }
    },
    select: { examinationDate: true },
    distinct: 'examinationDate',
    orderBy: [{ examinationDate: 'desc' }]
  })

  return examinationDates.filter(hasDefinedExaminationDate)
}

const securityCheck = (ctx: SecurityRuleContext) => {
  const permissions = getAppContextPermissions({
    user: ctx.user,
    structure: ctx.structure
  })
  return permissions.module.helpRequest
}

export const getExaminationDatesQuery = createQuery({
  handler,
  securityCheck,
  inputValidation: idSchema.optional()
})
