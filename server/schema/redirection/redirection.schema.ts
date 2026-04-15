import { z } from 'zod/v4'
import { SocialSupportRedirectionType } from '@prisma/client'
import { requiredNativeEnum, stringConstraint } from '../helpers.schema'
import { maxStringLengthMessage } from '~/utils/zod'

export const SocialSupportRedirectionSchema = z
  .object({
    id: z.string().uuid().nullish(),
    type: requiredNativeEnum(SocialSupportRedirectionType).nullish(),
    motif: stringConstraint.max(300, maxStringLengthMessage(300)).nullish(),
    externalStructureName: stringConstraint
      .max(300, maxStringLengthMessage(300))
      .nullish(),
    partnerOrganizationId: z.string().nullish(),
    partnerOrganizationContactId: z
      .string()
      .nullish()
      .transform(v => {
        if (v === '') {
          return null
        }
        return v
      })
  })
  .superRefine((data, ctx) => {
    if (
      data.type === SocialSupportRedirectionType.PartnerOrganization &&
      !data.partnerOrganizationId
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Veuillez renseigner ce champ',
        path: ['partnerOrganizationId']
      })
    }

    if (
      data.type === SocialSupportRedirectionType.Other &&
      !data.externalStructureName
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Veuillez renseigner ce champ',
        path: ['externalStructureName']
      })
    }

    // clean fields
    if (data.type === SocialSupportRedirectionType.Other) {
      data.partnerOrganizationContactId = null
      data.partnerOrganizationId = null
    }
    if (data.type === SocialSupportRedirectionType.Intern) {
      data.partnerOrganizationContactId = null
      data.partnerOrganizationId = null
      data.externalStructureName = null
    }
    if (data.type === SocialSupportRedirectionType.PartnerOrganization) {
      data.externalStructureName = null
    }
  })
export type SocialSupportRedirectionsInput = z.infer<
  typeof SocialSupportRedirectionSchema
>
