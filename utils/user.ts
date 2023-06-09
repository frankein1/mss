import { User } from '@prisma/client'

export const getUserDisplayName = (
  user: Pick<User, 'firstName' | 'lastName' | 'email'>
): string => {
  return `${user.firstName} ${user.lastName?.toUpperCase() || ''}`
}
