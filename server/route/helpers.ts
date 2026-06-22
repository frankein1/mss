import { Node } from 'prosemirror-model'
import type { JSONContent } from '@tiptap/core'
import { getSchema } from '@tiptap/core'
import { tiptapExtensions } from '~/utils/richTextEditor'
import {
  validatePartnerOrganizationIds,
  validateManyBelongToStructure,
  type SecurityRuleGrantee
} from '../security'
import { SupportProgramRepo } from '../database'

export const validateRichTextSchema = (richText: string): boolean => {
  try {
    const doc: JSONContent = JSON.parse(richText)
    const schema = getSchema(tiptapExtensions)
    const contentNode = Node.fromJSON(schema, doc)
    contentNode.check()
    return true
  } catch {
    return false
  }
}

interface PartnerPayload {
  prescribingOrganizationId?: string | null | undefined
  prescribingOrganizationContactId?: string | null | undefined
  instructorOrganizationId?: string | null | undefined
  instructorOrganizationContactId?: string | null | undefined
  socialSupportRedirections?:
    | {
        partnerOrganizationId?: string | null | undefined
        partnerOrganizationContactId?: string | null | undefined
      }[]
    | null
}

export function validateSocialSupportPartnerOrganisations<
  T extends PartnerPayload
>(user: SecurityRuleGrantee, input: T) {
  const partnerOrgIds: (string | null | undefined)[] = [
    input.prescribingOrganizationId,
    input.instructorOrganizationId
  ]
  const contactIds: (string | null | undefined)[] = [
    input.prescribingOrganizationContactId,
    input.instructorOrganizationContactId
  ]
  if (input.socialSupportRedirections?.length) {
    partnerOrgIds.push(
      ...input.socialSupportRedirections.map(r => r.partnerOrganizationId)
    )
    contactIds.push(
      ...input.socialSupportRedirections.map(
        r => r.partnerOrganizationContactId
      )
    )
  }

  return validatePartnerOrganizationIds(user, partnerOrgIds, contactIds)
}

export function validateSupportProgramId(
  user: SecurityRuleGrantee,
  supportProgramId: string | null | undefined
) {
  if (!supportProgramId) {
    return Promise.resolve(true)
  }
  return validateManyBelongToStructure(
    user,
    [supportProgramId],
    SupportProgramRepo.count
  )
}
