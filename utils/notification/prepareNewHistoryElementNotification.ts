import { Beneficiary, NotificationType } from '@prisma/client'
import { SecurityRuleGrantee } from '~/server/security'

export function prepareNewHistoryElementNotification(
  beneficiary: Pick<Beneficiary, 'id'> & { referents: { id: string }[] },
  user: SecurityRuleGrantee
) {
  return {
    createMany: {
      data: beneficiary.referents
        .filter(referent => referent.id !== user.id)
        .map(referent => ({
          beneficiaryId: beneficiary.id,
          recipientId: referent.id,
          type: NotificationType.NewHistoryElement
        }))
    }
  }
}
