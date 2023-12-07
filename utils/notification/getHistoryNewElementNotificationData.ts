import { NotificationType } from '@prisma/client'
import { BeneficiaryRepo } from '~/server/database'
import { SecurityRuleGrantee } from '~/server/security'

export async function getHistoryNewElementNotificationData(
  user: SecurityRuleGrantee,
  beneficiaryId: string
) {
  const beneficiary = await BeneficiaryRepo.findUniqueOrThrow(user, {
    where: { id: beneficiaryId },
    select: {
      referents: true
    }
  })

  return {
    createMany: {
      data: beneficiary.referents
        .filter(referent => referent.id !== user.id)
        .map(referent => ({
          beneficiaryId,
          recipientId: referent.id,
          type: NotificationType.NewHistoryElement
        }))
    }
  }
}
