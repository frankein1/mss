import type { SocialSupportSubject } from '~/prisma/generated/browser'
import type { FieldLabels } from '~/types/fieldLabels'

type SocialSupportSubjectFieldLabels = Pick<SocialSupportSubject, 'id' | 'name'>

export const socialSupportSubjectFieldLabels: FieldLabels<SocialSupportSubjectFieldLabels> =
  {
    id: 'Identifiant',
    name: 'Nom'
  }
