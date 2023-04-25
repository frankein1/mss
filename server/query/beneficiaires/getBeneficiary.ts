import { prismaClient } from '~/server/prisma'

const getBeneficiary = (fileNumber: string) =>
  prismaClient.beneficiary.findFirstOrThrow({
    where: { fileNumber }
  })

export { getBeneficiary }
