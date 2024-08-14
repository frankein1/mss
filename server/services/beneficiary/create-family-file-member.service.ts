import { BeneficiaryStatus, Prisma } from '@prisma/client'
import { BeneficiaryRepo } from '~/server/database'
import { CreateFamilyFileMemberInput } from '~/server/schema'
import { generateFileNumber } from '~/utils/generateFileNumber'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { connect } from '~/utils/prisma'

type CreateParams = {
  ctx: SecurityRuleContext
  input: CreateFamilyFileMemberInput
}

export async function createFamilyFileMember(params: CreateParams) {
  const { ctx, input } = params

  const { familyFileId, ...restOfInput } = input
  const fileNumber = generateFileNumber()

  const data: Prisma.BeneficiaryCreateInput = {
    status: BeneficiaryStatus.Active,
    draft: false,
    fileNumber,
    structure: connect(ctx.structure.id),
    createdBy: connect(ctx.user.id),
    familyFile: {
      ...connect(familyFileId)
    },
    ...restOfInput
  }

  const { id } = await BeneficiaryRepo.prisma.create({ data })

  return { id }
}
