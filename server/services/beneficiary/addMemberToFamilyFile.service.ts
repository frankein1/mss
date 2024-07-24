import { BeneficiaryStatus, Prisma } from '@prisma/client'
import { BeneficiaryRepo, FamilyFileRepo } from '~/server/database'
import { AddFamilyFileMemberInput } from '~/server/schema'
import { generateFileNumber } from '~/utils/generateFileNumber'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { connect, prepareRelationConnections } from '~/utils/prisma'

type CreateParams = {
  ctx: SecurityRuleContext
  input: AddFamilyFileMemberInput
}

async function updateReferents(
  user: SecurityRuleContext['user'],
  referents: string[],
  familyFileId: string
) {
  const target = await FamilyFileRepo.findUniqueOrThrow(user, {
    where: { id: familyFileId },
    include: {
      referents: true
    }
  })

  const { referents: previousReferents } = target

  return prepareRelationConnections(
    referents,
    previousReferents.map(({ id }) => id)
  )
}

export async function addMemberToFamilyFile(params: CreateParams) {
  const { ctx, input } = params

  const { referents, familyFileId, ...restOfInput } = input
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
  const updated = await updateReferents(ctx.user, referents, familyFileId)

  const [{ id }, _] = await Promise.all([
    BeneficiaryRepo.prisma.create({ data }),
    FamilyFileRepo.prisma.update({
      where: { id: familyFileId },
      data: {
        referents: updated
      }
    })
  ])

  return { id }
}
