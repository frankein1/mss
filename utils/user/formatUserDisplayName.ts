import { User } from '@prisma/client'

export const formatUserDisplayName = (
  user: Pick<User, 'firstName' | 'lastName'>
): string => {
  return `${user.firstName} ${user.lastName?.toUpperCase() || ''}`
}
