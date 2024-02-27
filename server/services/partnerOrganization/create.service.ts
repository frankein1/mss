import { v4 } from 'uuid'
import { PartnerOrganizationRepo } from '~/server/database'
import { AddPartnerOrganizationInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'

export async function create({
  input,
  ctx
}: {
  ctx: SecurityRuleContext
  input: AddPartnerOrganizationInput
}) {
  const { contacts, ...data } = input

  const contactsToCreate = (contacts || []).map(({ name, email, phone }) => ({
    id: v4(),
    name,
    email,
    phone
  }))

  const res = await PartnerOrganizationRepo.prisma.create({
    data: {
      ...data,
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
