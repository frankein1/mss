import { TRPCError } from '@trpc/server'
import { prismaClient } from '~/server/prisma'

export async function getBeneficiaryReferentsAndRelatives({
  structureId,
  id
}: {
  structureId: string | null
  id: string
}) {
  const where = {
    id,
    structureId: structureId || undefined
  }

  const beneficiary = await prismaClient.beneficiary.findFirst({
    where,
    include: {
      referents: true,
      relatives: {
        include: {
          linkedBeneficiary: true
        }
      }
    }
  })
  if (!beneficiary) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `No beneficiary found with conditions ${JSON.stringify(where)}`
    })
  }
  return beneficiary
}
