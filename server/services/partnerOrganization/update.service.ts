import { PartnerOrganizationRepo } from '~/server/database'
import { EditPartnerOrganizationInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'

export async function update({
  input,
  ctx
}: {
  ctx: SecurityRuleContext
  input: EditPartnerOrganizationInput
}) {
  const { contacts, ...data } = input

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

  const res = await PartnerOrganizationRepo.prisma.update({
    where: {
      id: input.id
    },
    data: {
      ...data,
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
