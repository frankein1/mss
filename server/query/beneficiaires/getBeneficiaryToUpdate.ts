import { beneficiarySecurityTargetSelect } from '~/server/query/security'
import { prismaClient } from '~/server/prisma'

const getBeneficiaryToUpdate = (fileNumber: string) =>
  prismaClient.beneficiary.findFirst({
    where: { fileNumber, archived: null },
    select: {
      ...beneficiarySecurityTargetSelect,
      fileNumber: true,
      firstName: true,
      birthName: true,
      usualName: true,
      email: true
    }
  })

export { getBeneficiaryToUpdate }
