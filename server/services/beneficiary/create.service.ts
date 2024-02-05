import { prepareDataFromDraft } from './helper'
import { BeneficiaryRepo, DraftRepo } from '~/server/database'
import { CreateBeneficiaryInput, SaveDraftInput } from '~/server/schema'
import { generateFileNumber } from '~/utils/generateFileNumber'
import { SecurityRuleContext } from '~/server/security/rules/types'

type CreateParams =
  | {
      ctx: SecurityRuleContext
      input: CreateBeneficiaryInput
      draftId?: undefined
    }
  | {
      ctx: SecurityRuleContext
      input: SaveDraftInput
      draftId: string
    }

async function prepareData({ ctx, input, draftId }: CreateParams) {
  if (draftId === undefined) {
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

  const beneficiaryDraft = await DraftRepo.findUniqueOrThrow(ctx.user, {
    where: { id: draftId }
  })

  return prepareDataFromDraft(ctx, input, beneficiaryDraft)
}

export async function create(params: CreateParams) {
  const data = await prepareData(params)

  const { id } = await BeneficiaryRepo.prisma.create({ data })

  const { draftId, ctx } = params

  if (draftId) {
    await DraftRepo.delete(ctx.user, {
      where: {
        id: draftId
      }
    })
  }

  return { id }
}
