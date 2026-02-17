import type { MinisterEntity } from '@prisma/client'

export function formatMinisterName(
  minister: Pick<MinisterEntity, 'lastName' | 'firstName' | 'function'>
) {
  return `${minister.firstName} ${minister.lastName} (${minister.function})`
}
