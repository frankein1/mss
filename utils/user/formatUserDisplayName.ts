import type { User } from '~/prisma/generated/browser'

export const formatUserDisplayName = (
  user: Pick<User, 'firstName' | 'lastName'>
): string => {
  return `${user.firstName} ${user.lastName?.toUpperCase() || ''}`
}
