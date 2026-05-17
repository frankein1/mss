import { PartnerOrganizationRepo } from '~/server/database'
import type { EditPartnerOrganizationInput } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security/rules/types'

export async function update({
  input,
  ctx
}: {
  ctx: SecurityRuleContext
  input: EditPartnerOrganizationInput
}) {
  const { contacts, ...data } = input

  const partner =
    data.dataSource === 'DataInclusionV1'
      ? {
          dataSource: 'DataInclusionV1' as const,
          dataInclusionId: null,
          dataInclusionIdV1: data.dataInclusionIdV1,
          name: data.name,
          ...(data.phone2 && { phone2: data.phone2 }),
          siret: null,
          address: null,
          zipcode: null,
          city: null,
          email: null,
          phone1: null,
          workingHours: null
        }
      : {
          dataSource: 'Custom' as const,
          dataInclusionId: null,
          dataInclusionIdV1: null,
          name: data.name,
          siret: data.siret,
          address: data.address,
          zipcode: data.zipcode,
          city: data.city,
          email: data.email,
          phone1: data.phone1,
          phone2: data.phone2,
          workingHours: data.workingHours
        }

  const previous = await PartnerOrganizationRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.id },
    select: {
      contacts: {
        select: { id: true }
      }
    }
  })
  const previousIds = previous.contacts.map(c => c.id)
  const newsIds = (contacts || []).map(c => c.id)

  const contactsToCreate = (contacts || []).filter(
    c => !previousIds.includes(c.id)
  )

  const contactsToDelete = (previousIds || [])
    .filter(id => !newsIds.includes(id))
    .map(id => ({ id }))

  const contactsToUpdate = (contacts || [])
    .filter(c => previousIds.includes(c.id) && newsIds.includes(c.id))
    .map(({ id, name, email, phone }) => ({
      where: { id: id || '' },
      data: {
        name,
        email,
        phone
      }
    }))

  const res = await PartnerOrganizationRepo.update(ctx.user, {
    where: {
      id: input.id,
      structureId: ctx.structure.id
    },
    data: {
      ...partner,
      inactive: false,
      contacts: {
        create: contactsToCreate,
        delete: contactsToDelete,
        update: contactsToUpdate
      }
    },
    select: {
      id: true,
      name: true
    }
  })
  return res
}
