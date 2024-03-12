import { BeneficiaryRepo } from '~/server/database'
import { CreateBeneficiaryInput } from '~/server/schema'
import { generateFileNumber } from '~/utils/generateFileNumber'
import { SecurityRuleContext } from '~/server/security/rules/types'

type CreateParams = {
  ctx: SecurityRuleContext
  input: CreateBeneficiaryInput
}

function prepareData({ ctx, input }: CreateParams) {
  const { referents, ...data } = input

  const fileNumber = generateFileNumber()

  return {
    structureId: ctx.structure.id,
    fileNumber,
    referents: {
      connect: referents.map(referent => ({ id: referent }))
    },
    createdById: ctx.user.id,
    ...data
  }
}

export async function create(params: CreateParams) {
  const data = await prepareData(params)

  const { id } = await BeneficiaryRepo.prisma.create({ data })

  return { id }
}
