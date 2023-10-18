import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SecurityRuleGrantee,
  canViewAnyHelpRequestDetails
} from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'
import {
  HelpRequestRepo,
  appendConstraintOnHelpRequest
} from '~/server/database'

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
    examinationDate: { not: null },
    beneficiary: input?.id ? { id: input?.id } : {}
  }

  appendConstraintOnHelpRequest(user, where)

  const examinationDates = await HelpRequestRepo.groupBy({
    by: ['examinationDate'],
    where,
    orderBy: [{ examinationDate: 'desc' }]
  })

  return examinationDates.filter(hasDefinedExaminationDate)
}

const securityCheck = (
  user: SecurityRuleGrantee,
  _input: IdInput | undefined
) => {
  return canViewAnyHelpRequestDetails(user)
}

export const getExaminationDatesQuery = createQuery({
  handler,
  securityCheck,
  inputValidation: idSchema.optional()
})
