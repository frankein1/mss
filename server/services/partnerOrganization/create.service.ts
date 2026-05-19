import { PartnerOrganizationRepo } from '~/server/database'
import type { AddPartnerOrganizationInput } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security/rules/types'

export async function create({
  input,
  ctx
}: {
  ctx: SecurityRuleContext
  input: AddPartnerOrganizationInput
}) {
  const { contacts, ...data } = input

  const partner =
    data.dataSource === 'DataInclusionV1'
      ? {
          dataSource: 'DataInclusionV1' as const,
          dataInclusionIdV1: data.dataInclusionIdV1,
          name: data.name,
          ...(data.phone2 && { phone2: data.phone2 })
        }
      : {
          dataSource: 'Custom' as const,
          name: data.name,
          siret: data.siret,
          address: data.address,
          zipcode: data.zipcode,
          city: data.city,
          email: data.email,
          phone1: data.phone1,
          phone2: data.phone2,
          website: data.website,
          workingHours: data.workingHours
        }

  const contactsToCreate = (contacts || []).map(
    ({ id, name, email, phone }) => ({
      id,
      name,
      email,
      phone
    })
  )

  const res = await PartnerOrganizationRepo.prisma.create({
    data: {
      ...partner,
      createdById: ctx.user.id,
      structureId: ctx.structure.id,
      contacts: {
        create: contactsToCreate
      }
    },
    select: {
      id: true,
      name: true
    }
  })
  return res
}
