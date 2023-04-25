import { beneficiarySecurityTargetSelect } from '~/server/query/security'
import { prismaClient } from '~/server/prisma'

const getHelpRequest = (helpRequestId: string) =>
  prismaClient.helpRequest.findFirst({
    where: {
      id: helpRequestId
    },
    select: {
      structureId: true,
      createdById: true,
      beneficiary: {
        select: {
          ...beneficiarySecurityTargetSelect,
          firstName: true,
          birthName: true,
          usualName: true,
          email: true,
          fileNumber: true,
          documents: {
            select: { key: true, type: true, name: true }
          }
        }
      }
    }
  })

export { getHelpRequest }
