import type { SocialSupportRedirection } from '@prisma/client'
import type { FieldLabels } from '~/types/fieldLabels'

type SocialSupportRedirectionLabels = Pick<
  SocialSupportRedirection,
  | 'type'
  | 'motif'
  | 'partnerOrganizationId'
  | 'partnerOrganizationContactId'
  | 'externalStructureName'
>

export const socialSupportRedirectionLabels: FieldLabels<SocialSupportRedirectionLabels> =
  {
    type: 'Type',
    motif: 'Motif',
    partnerOrganizationId: 'Organisme partenaire',
    partnerOrganizationContactId: "Contact de l'organisme partenaire",
    externalStructureName: 'Nom structure/personne'
  }

export const redirectionExportLabels: FieldLabels<SocialSupportRedirectionLabels> =
  {
    type: 'Types de redirection',
    motif: 'Motifs de redirection',
    partnerOrganizationId: 'Redirection vers organisme partenaire',
    partnerOrganizationContactId: 'Contact des partenaires de redirection',
    externalStructureName: 'Structures/Personnes associée aux redirections'
  }
