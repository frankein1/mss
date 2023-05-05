import { FollowupType } from '@prisma/client'
import { FieldLabels } from '~/types/fieldLabels'

type FollowupTypeFieldLabels = Pick<FollowupType, 'id' | 'name'>

export const followupTypeFieldLabels: FieldLabels<FollowupTypeFieldLabels> = {
  id: 'Identifiant',
  name: 'Nom'
}
