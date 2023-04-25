import { beneficiarySecurityTargetSelect } from '~/server/query/security'
import { prismaClient } from '~/server/prisma'

const getBeneficiary = (fileNumber: string) =>
  prismaClient.beneficiary.findUnique({
    where: {
      fileNumber
    },
    select: {
      ...beneficiarySecurityTargetSelect,
      firstName: true,
      birthName: true,
      usualName: true,
      fileNumber: true,
      email: true,
      documents: {
        select: { key: true, type: true, name: true }
      }
    }
  })

export { getBeneficiary }
