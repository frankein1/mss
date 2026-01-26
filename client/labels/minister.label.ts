import type { MinisterEntity, User } from '@prisma/client'
import type { FieldLabels } from '~/types/fieldLabels'

export const ministerFieldLabels: FieldLabels<MinisterEntity> = {
  id: 'Identifiant',
  lastName: 'Nom',
  firstName: 'Prénom',
  function: 'Fonction',
  ministry: 'Ministère',
  government: 'Gouvernement',
  former: 'Ancien ministre',
  created: 'Date de création',
  updated: 'Date de mise à jour'
}
