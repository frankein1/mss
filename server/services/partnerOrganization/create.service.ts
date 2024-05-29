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

  const partner =
    'dataInclusionId' in data
      ? {
          dataInclusionId: data.dataInclusionId,
          name: data.name,
          ...(data.phone2 && { phone2: data.phone2 })
        }
      : data

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
