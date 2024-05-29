import { User } from '@prisma/client'
import { FieldLabels } from '~/types/fieldLabels'

export const userFieldLabels: FieldLabels<User> = {
  id: 'Identifiant',
  lastName: 'Nom',
  firstName: 'Prénom',
  email: 'Email',
  role: 'Rôle',
  status: 'Accès',
  aidantConnectAuthorisation: 'Aidants Connect',
  lastAccess: 'Dernier accès',
  created: 'Date de création',
  updated: 'Date de mise à jour',
  structureId: 'Identifiant de la structure',
  accessToken: "Token d'accès",
  accessTokenValidity: "Date d'expiration du token"
}
