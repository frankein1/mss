import { AppContext } from '~/server/trpc'

import { prismaClient } from '~/server/prisma'

export const getBeneficiaryDocumentsHandler = async (args: {
  input: { beneficiaryId: string }
  ctx: AppContext
}) => {
  const { input } = args
  return await prismaClient.document.findMany({
    where: {
      beneficiaryId: input.beneficiaryId
    }
  })
}
