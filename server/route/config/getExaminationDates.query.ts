import {
  hasDefinedExaminationDate,
  prepareExaminationDatesBeneficiaryCondition
} from './helper'
import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import {
  SecurityRuleGrantee,
  canViewAnyHelpRequestDetails
} from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'

const handler = async ({
  input,
  ctx: { user, structure }
}: {
  input: { id: string } | undefined
  ctx: ProtectedAppContext
}) => {
  const beneficiaryCondition = prepareExaminationDatesBeneficiaryCondition(
    input?.id,
    user
  )

  const examinationDates = await prismaClient.helpRequest.groupBy({
    by: ['examinationDate'],
    where: {
      examinationDate: { not: null },
      structureId: structure.id,
      beneficiary: beneficiaryCondition
    },
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
