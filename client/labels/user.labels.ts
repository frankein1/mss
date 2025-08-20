import type { User } from '@prisma/client'
import type { FieldLabels } from '~/types/fieldLabels'

export const userFieldLabels: FieldLabels<User> = {
  id: 'Identifiant',
  lastName: 'Nom',
  firstName: 'Prénom',
  email: 'Email',
  role: 'Rôle',
  status: 'Accès',
  aidantConnectAuthorisation: 'Aidants Connect',
  firstAccess: 'Premier accès',
  lastAccess: 'Dernier accès',
  created: 'Date de création',
  updated: 'Date de mise à jour',
  structureId: 'Identifiant de la structure',
  externalRdvspId: 'Identifiant Rendez-vous Service Public',
  authorizationCode: "Code d'autorisation",
  authorizationCodeValidity: "Validité du code d'autorisation",
  accountReminderEmail: "Nombre d'e-mail de rappel de création de compte"
}
