import {
  getAppContextPermissions,
  getSocialSupportPermissions,
  type SecurityRuleContext
} from '~/server/security'
import type { FamilyFileSecurityTarget } from '~/server/services'
import {
  filterComments,
  filterDocuments,
  filterFileInstruction,
  filterFollowup,
  filterHelpRequest,
  filterHousingHelpRequest,
  filterSocialSupport
} from '~/server/services/helper'
import type { ProtectedAppContext } from '~/server/trpc'
import type { SocialSupportDetail } from './getDetails.query'
import { StructureRepo } from '~/server/database'
import type {
  AddFollowupInput,
  CreateHelpRequestInput,
  CreateHousingHelpRequestInput,
  EditFollowupInput,
  EditHelpRequestInput,
  EditHousingHelpRequestInput
} from '~/server/schema'

export function formatSocialSupportDetail(
  socialSupport: SocialSupportDetail,
  ctx: ProtectedAppContext,
  familyFile: FamilyFileSecurityTarget
) {
  const { _count } = socialSupport

  const socialSupportPermissions = getSocialSupportPermissions({
    ctx,
    familyFile,
    socialSupport
  })

  const appPermissions = getAppContextPermissions(ctx)

  const { followup, fileInstruction, minister, documents, comments } =
    socialSupport

  const conditions = {
    minister: appPermissions.module.ministere,
    details: socialSupportPermissions.get.details,
    privateSynthesis: socialSupportPermissions.get.privateSynthesis
  }

  const filteredSocialSupport = filterSocialSupport({
    socialSupport,
    conditions
  })

  const filteredFileInstruction = fileInstruction
    ? filterFileInstruction({
        fileInstruction,
        conditions
      })
    : null

  const helpRequest = fileInstruction?.helpRequest
  const housingHelpRequest = fileInstruction?.housingHelpRequest

  const filteredHousingHelpRequest = housingHelpRequest
    ? filterHousingHelpRequest({
        housingHelpRequest,
        conditions
      })
    : null
  const filteredHelpRequest = helpRequest
    ? filterHelpRequest({
        helpRequest,
        conditions
      })
    : null

  const filteredFollowup = followup
    ? filterFollowup({
        followup,
        conditions
      })
    : null

  const documentItems = filterDocuments({
    documents,
    conditions,
    ctx,
    familyFile
  })

  const commentItems = filterComments({ comments, ctx })

  return {
    data: {
      ...filteredSocialSupport,
      minister: minister,
      comments: commentItems,
      documents: documentItems,
      hasUnreadNotifications: !!_count.notifications,
      followup: filteredFollowup,
      fileInstruction: {
        ...filteredFileInstruction,
        helpRequest: filteredHelpRequest,
        housingHelpRequest: filteredHousingHelpRequest
      }
    },
    permissions: socialSupportPermissions
  }
}

export const checkRedirectionPermissions = async (
  redirections:
    | AddFollowupInput['socialSupportRedirections']
    | EditFollowupInput['socialSupportRedirections']
    | CreateHelpRequestInput['socialSupportRedirections']
    | EditHelpRequestInput['socialSupportRedirections']
    | EditHousingHelpRequestInput['socialSupportRedirections']
    | CreateHousingHelpRequestInput['socialSupportRedirections'],
  ctx: SecurityRuleContext
) => {
  if (!redirections?.length) {
    return true
  }
  const structure = await StructureRepo.findUniqueOrThrow(ctx.user, {
    where: {
      id: ctx.structure.id
    },
    select: {
      partnerOrganizations: {
        select: {
          id: true,
          contacts: {
            select: {
              id: true
            }
          }
        }
      }
    }
  })
  const partnerIdsFromStructure = structure.partnerOrganizations.map(p => p.id)
  const contactIdsFromStructure = structure.partnerOrganizations.flatMap(p =>
    p.contacts.map(c => c.id)
  )

  const partnerOrganizationsIds = redirections
    .map(r => r.partnerOrganizationId)
    .filter(id => id != '')
    .filter(id => id != null)
  const partnerOrganizationsContactIds = redirections
    .map(r => r.partnerOrganizationContactId)
    .filter(id => id != '')
    .filter(id => id != null)

  const allPartnersValid = partnerOrganizationsIds.every(id =>
    partnerIdsFromStructure.includes(id)
  )
  const allContactsValid = partnerOrganizationsContactIds.every(id =>
    contactIdsFromStructure.includes(id)
  )

  if (!allPartnersValid || !allContactsValid) {
    return false
  }
  return true
}
