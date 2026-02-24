import {
  getAppContextPermissions,
  getCommentPermissions,
  getDocumentPermissions,
  getSocialSupportPermissions
} from '~/server/security'
import type { FamilyFileSecurityTarget } from '~/server/services'
import {
  filterFileInstruction,
  filterFollowup,
  filterHelpRequest,
  filterHousingHelpRequest,
  filterSocialSupport
} from '~/server/services/helper'
import type { ProtectedAppContext } from '~/server/trpc'
import type { SocialSupportDetail } from './getDetails.query'

export function formatSocialSupportDetail(
  socialSupport: SocialSupportDetail,
  ctx: ProtectedAppContext,
  familyFile: FamilyFileSecurityTarget
) {
  const {
    rdvsp: { issuer }
  } = useRuntimeConfig()

  const { _count } = socialSupport

  const socialSupportPermissions = getSocialSupportPermissions({
    ctx,
    familyFile,
    socialSupport
  })

  const appPermissions = getAppContextPermissions(ctx)

  const { followup, fileInstruction } = socialSupport

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

  const { documents, comments, ...otherData } = filteredSocialSupport

  const documentItems = documents?.map(document => ({
    document,
    permissions: getDocumentPermissions({
      ctx,
      familyFile,
      document
    })
  }))
  const commentItems = comments?.map(comment => ({
    comment,
    permissions: getCommentPermissions({
      ctx,
      comment
    })
  }))

  return {
    data: {
      ...otherData,
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
