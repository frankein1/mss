import { Beneficiary, NotificationType } from '@prisma/client'
import { SecurityRuleGrantee } from '~/server/security'

export function prepareNewHistoryElementNotification(
  beneficiary: Beneficiary & { referents: { id: string }[] },
  user: SecurityRuleGrantee
) {
  return {
    createMany: {
      data: beneficiary.referents
        .filter(referent => referent.id !== user.id)
        .map(referent => ({
          beneficiaryId: beneficiary.id,
          recipientId: referent.id,
          type: NotificationType.NewHistoryElement,
          itemCreatedById: user.id
        }))
    }
  }
}
