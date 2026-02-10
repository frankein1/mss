import type {
  PartnerOrganization,
  PartnerOrganizationContact
} from '~/prisma/generated/browser'

export type PartnerOrganizationIdName = Pick<
  PartnerOrganization,
  'id' | 'name'
> & {
  contacts: Pick<PartnerOrganizationContact, 'id' | 'name'>[] | null
}
