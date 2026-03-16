import { SocialSupportRedirectionType } from '@prisma/client'
import { buildKeys } from '~/utils/keys/keyBuilder'

export const socialSupportRedirectionTypeKeys = buildKeys({
  [SocialSupportRedirectionType.PartnerOrganization]: `Organisme partenaire`,
  [SocialSupportRedirectionType.Intern]: 'En interne',
  [SocialSupportRedirectionType.Other]: 'Autre structure/personne'
})
