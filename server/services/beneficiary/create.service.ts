import { prepareDataFromDraft } from './helpers'
import { BeneficiaryRepo, DraftRepo } from '~/server/database'
import { CreateBeneficiaryInput, SaveDraftInput } from '~/server/schema'
import { prepareDateFields } from '~/utils/prisma'
import { generateFileNumber } from '~/utils/generateFileNumber'
import { ProtectedAppContext } from '~/server/trpc'

type CreateParams =
  | {
      ctx: Omit<ProtectedAppContext, 'event'>
      input: CreateBeneficiaryInput
      draftId?: undefined
    }
  | {
      ctx: Omit<ProtectedAppContext, 'event'>
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
      ...prepareDateFields(data, ['birthDate'])
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
