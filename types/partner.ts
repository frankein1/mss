import { PartnerOrganization, PartnerOrganizationContact } from '@prisma/client'

export type PartnerOrganizationIdName = Pick<
  PartnerOrganization,
  'id' | 'name'
> & {
  contacts: Pick<PartnerOrganizationContact, 'id' | 'name'>[] | null
}
