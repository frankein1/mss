import { FieldLabels } from '~/types/fieldLabels'
import { User } from '~/server/prisma/prismaClient'

type UserFieldLabels = Omit<User, 'password'>

export const userFieldLabels: FieldLabels<UserFieldLabels> = {
  id: 'Identifiant',
  lastName: 'Nom',
  firstName: 'Prénom',
  email: 'Email',
  role: 'Rôle',
  status: 'Accès',
  aidantConnectAuthorisation: 'Aidant Connect',
  lastAccess: 'Dernier accès',
  created: 'Date de création',
  updated: 'Date de mise à jour',
  structureId: 'Identifiant de la structure'
}
