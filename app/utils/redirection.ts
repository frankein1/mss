import type { SocialSupportRedirectionType } from '@prisma/client'
import type { SocialSupportRedirectionsInput } from '~~/server/schema'

type RedirectionRead = {
  id: string
  type: SocialSupportRedirectionType | null
  externalStructureName: string | null
  partnerOrganizationId: string | null
  partnerOrganizationContactId: string | null
  redirectionReasonName: string | null
}

export function toRedirectionFormValues(
  redirections: RedirectionRead[] | null | undefined
): SocialSupportRedirectionsInput[] {
  return (redirections ?? []).map(r => ({
    id: r.id,
    type: r.type,
    redirectionReasonName: r.redirectionReasonName,
    externalStructureName: r.externalStructureName,
    partnerOrganizationId: r.partnerOrganizationId,
    partnerOrganizationContactId: r.partnerOrganizationContactId
  }))
}
