import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import { idSchema } from '~/server/schema'
import { HelpRequestRepo, HelpRequestConstraints } from '~/server/database'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'

function hasDefinedExaminationDate(h: {
  examinationDate: Date | null
}): h is { examinationDate: Date } {
  return h.examinationDate !== null
}

const handler = async ({
  input,
  ctx: { user }
}: {
  input: { id: string } | undefined
  ctx: ProtectedAppContext
}) => {
  const where = {
    where: {
      examinationDate: { not: null },
      socialSupport: {
        beneficiary: input?.id ? { id: input?.id } : {}
      }
    }
  }

  appendConstraints(user, where, HelpRequestConstraints.get)

  const examinationDates = await HelpRequestRepo.prisma.groupBy({
    by: ['examinationDate'],
    ...where,
    orderBy: [{ examinationDate: 'desc' }]
  })

  return examinationDates.filter(hasDefinedExaminationDate)
}

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.helpRequest

export const getExaminationDatesQuery = createQuery({
  handler,
  securityCheck,
  inputValidation: idSchema.optional()
})
