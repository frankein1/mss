import { v4 } from 'uuid'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { MutationLogAction } from '~/types/mutationLogs'
import { canOnlyListItsBeneficiaries } from '~/server/security/rules'

export const getBeneficiariesMutationLogsHandler = async ({
  ctx: { user }
}: {
  ctx: ProtectedAppContext
}) => {
  const referentsCondition = canOnlyListItsBeneficiaries(user)
    ? { some: { id: user.id } }
    : undefined

  const [beneficiaryCreation, beneficiaryArchiving] = await Promise.all([
    prismaClient.beneficiary.findMany({
      where: {
        structureId: user.structureId,
        created: { not: null },
        referents: referentsCondition
      },
      select: {
        id: true,
        created: true,
        createdBy: {
          select: { firstName: true, lastName: true }
        }
      },
      orderBy: {
        created: 'asc'
      }
    }),
    prismaClient.beneficiary.findMany({
      where: {
        structureId: user.structureId,
        archived: { not: null },
        referents: referentsCondition
      },
      select: {
        id: true,
        archived: true,
        archivedBy: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        archived: 'asc'
      }
    })
  ])

  const creationMutationLogs = beneficiaryCreation.map(creation => ({
    id: v4(),
    date: creation.created,
    action: MutationLogAction.Creation,
    itemId: creation.id,
    author: creation.createdBy
  }))

  const archivingMutationLogs = beneficiaryArchiving.map(archiving => ({
    id: v4(),
    date: archiving.archived,
    action: MutationLogAction.Archiving,
    itemId: archiving.id,
    author: archiving.archivedBy
  }))

  return [...creationMutationLogs, ...archivingMutationLogs]
}
