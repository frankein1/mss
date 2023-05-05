import { v4 } from 'uuid'
import { Prisma } from '@prisma/client'
import { SecurityRuleGrantee } from '../security/rules'
import { AddFollowupInput } from '~/server/schema'

export const addFollowup = async ({
  input,
  transaction,
  user
}: {
  input: AddFollowupInput
  transaction: Prisma.TransactionClient
  user: SecurityRuleGrantee
}) => {
  const { beneficiaryId, types, documents, date, dueDate, ...data } = input

  const id = v4()

  // TODO better way to pass along structureId in mutation context extra props
  const { structureId } = await transaction.beneficiary.findUniqueOrThrow({
    where: { id: beneficiaryId },
    select: { structureId: true }
  })

  const followup = await transaction.followup.create({
    data: {
      id,
      structureId,
      beneficiaryId,
      // TODO Helper for date string => Date
      date: new Date(date),
      dueDate: dueDate ? new Date(dueDate) : null,
      types: {
        connect: types.map(type => ({ id: type }))
      },
      documents: {
        connect: documents.map(key => ({ key }))
      },
      createdById: user.id,
      ...data
    },
    include: {
      beneficiary: {
        select: {
          id: true,
          fileNumber: true
        }
      }
    }
  })

  return { followup }
}
