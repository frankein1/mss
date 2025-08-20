import type { SocialSupportSubject } from '@prisma/client'
import type { FieldLabels } from '~/types/fieldLabels'

type SocialSupportSubjectFieldLabels = Pick<SocialSupportSubject, 'id' | 'name'>

export const socialSupportSubjectFieldLabels: FieldLabels<SocialSupportSubjectFieldLabels> =
  {
    id: 'Identifiant',
    name: 'Nom'
  }
