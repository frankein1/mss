import type { MinisterEntity } from '@prisma/client'

export function formatMinisterName(
  minister: Pick<
    MinisterEntity,
    'lastName' | 'firstName' | 'function' | 'government'
  >
) {
  if (minister.government && minister.government != 'non renseigné') {
    return `${minister.firstName} ${minister.lastName} – Gvt ${minister.government} (${minister.function})`
  }
  return `${minister.firstName} ${minister.lastName} (${minister.function})`
}
