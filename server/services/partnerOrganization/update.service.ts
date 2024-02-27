import { v4 } from 'uuid'
import { PartnerOrganizationRepo } from '~/server/database'
import { EditPartnerOrganizationInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'

export async function update({
  input,
  ctx: _ctx
}: {
  ctx: SecurityRuleContext
  input: EditPartnerOrganizationInput
}) {
  const { contacts, ...data } = input

  const contactsToCreate = (contacts || [])
    .filter(c => !c.id)
    .map(({ name, email, phone }) => ({ id: v4(), name, email, phone }))

  const contactsToDelete = (contacts || [])
    .filter(c => c.deleted && c.id)
    .map(c => ({ id: c.id || '' }))

  const contactsToUpdate = (contacts || [])
    .filter(c => !c.deleted && c.id)
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
