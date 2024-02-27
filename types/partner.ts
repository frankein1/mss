import { PartnerOrganization } from '@prisma/client'

export type PartnerOrganizationIdName = Pick<PartnerOrganization, 'id' | 'name'>
