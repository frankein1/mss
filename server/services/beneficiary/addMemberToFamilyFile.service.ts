import { BeneficiaryRepo } from '~/server/database'
import { AddFamilyFileMemberInput } from '~/server/schema'
import { generateFileNumber } from '~/utils/generateFileNumber'
import { SecurityRuleContext } from '~/server/security/rules/types'

type CreateParams = {
  ctx: SecurityRuleContext
  input: AddFamilyFileMemberInput
}

export async function addMemberToFamilyFile(params: CreateParams) {
  const { ctx, input } = params
  const { /** referents, */ ...restOfInput } = input

  const fileNumber = generateFileNumber()

  // TODO update referents to connect and disconnect
  const data = {
    fileNumber,
    structureId: ctx.structure.id,
    createdById: ctx.user.id,
    ...restOfInput
  }

  const { id } = await BeneficiaryRepo.prisma.create({
    data
  })

  return { id }
}
