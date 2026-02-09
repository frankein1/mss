import type { User } from '~/prisma/generated/client'

export const formatUserDisplayName = (
  user: Pick<User, 'firstName' | 'lastName'>
): string => {
  return `${user.firstName} ${user.lastName?.toUpperCase() || ''}`
}
