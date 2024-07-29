import { BeneficiaryStatus, Prisma } from '@prisma/client'
import { BeneficiaryRepo } from '~/server/database'
import { AddFamilyFileMemberInput } from '~/server/schema'
import { generateFileNumber } from '~/utils/generateFileNumber'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { connect } from '~/utils/prisma'

type CreateParams = {
  ctx: SecurityRuleContext
  input: AddFamilyFileMemberInput
}

export async function addMemberToFamilyFile(params: CreateParams) {
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
