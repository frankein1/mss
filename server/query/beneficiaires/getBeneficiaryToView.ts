import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'

const getBeneficiaryToView = (fileNumber: string) =>
  prismaClient.beneficiary.findFirstOrThrow({
    where: { fileNumber },
    include: {
      referents: true
    }
  })

export { getBeneficiaryToView }

export type GetBeneficiaryToViewReturn = Prisma.PromiseReturnType<
  typeof getBeneficiaryToView
>
