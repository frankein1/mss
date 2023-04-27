import { User } from '@prisma/client'

// [NUXT/PRISMA] Replaces utils/index.js@agentName
export const getUserDisplayName = (
  user: Pick<User, 'firstName' | 'lastName' | 'email'>
): string => {
  return `${user.firstName} ${user.lastName?.toUpperCase() || ''}`
}
