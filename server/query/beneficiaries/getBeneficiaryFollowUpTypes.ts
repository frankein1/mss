import { FollowupTypeIdAndName } from '~/types/followupType'
import { prismaClient } from '~/server/prisma'

export async function getBeneficiaryFollowUpTypes(
  beneficiaryId: string
): Promise<FollowupTypeIdAndName[]> {
  const types = await prismaClient.viewBeneficiaryTypes.findMany({
    where: {
      beneficiaryId
    },
    orderBy: [
      {
        name: 'desc'
      }
    ],
    select: {
      typeId: true,
      name: true
    }
  })
  return (types || []).map(type => ({ id: type.typeId, name: type.name }))
}
