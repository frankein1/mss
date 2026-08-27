import { UserRole } from '@prisma/client'

type UserPayload = { id: string; role: UserRole }

const ALLOWED_ROLES: ReadonlySet<UserRole> = new Set([
  UserRole.StructureManager,
  UserRole.SocialWorker,
  UserRole.Referent
])

function getEligibleReferentIds(referents: UserPayload[]): Set<string> {
  const ids = new Set<string>()
  for (const referent of referents) {
    if (ALLOWED_ROLES.has(referent.role)) {
      ids.add(referent.id)
    }
  }
  return ids
}

export function getDocumentNotificationRecipientIds({
  createdById,
  confidential,
  referents
}: {
  createdById: string
  confidential: boolean
  referents: UserPayload[]
}): Set<string> {
  if (confidential) {
    return new Set([createdById])
  }
  const ids = getEligibleReferentIds(referents)
  ids.add(createdById)
  return ids
}

export function getSocialSupportNotificationRecipientIds({
  createdById,
  referents
}: {
  createdById: string | null
  referents: UserPayload[]
}): Set<string> {
  const ids = getEligibleReferentIds(referents)
  if (createdById !== null) {
    ids.add(createdById)
  }
  return ids
}

export function getSupportProgramNotificationRecipientIds({
  createdByIds,
  referents
}: {
  createdByIds: (string | null)[]
  referents: UserPayload[]
}): Set<string> {
  const ids = getEligibleReferentIds(referents)
  for (const createdById of createdByIds) {
    if (createdById !== null) {
      ids.add(createdById)
    }
  }
  return ids
}
