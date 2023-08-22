import { User } from '@prisma/client'

export const getUserDisplayName = (
  user: Pick<User, 'firstName' | 'lastName'>
): string => {
  return `${user.firstName} ${user.lastName?.toUpperCase() || ''}`
}

export function getUserCreationMessage(email: string) {
  return `Le nouvel utilisateur ${email} a correctement été créé. Il recevra dans quelques instants un email l'invitant à créer son compte Inclusion Connect. Pensez à l'informer de la réception de ce mail et de l'inviter si nécessaire à vérifier ses spams.`
}
