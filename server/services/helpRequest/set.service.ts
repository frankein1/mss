import { Beneficiary } from '@prisma/client'
import {
  prepareHelpRequestCreateData,
  prepareHelpRequestUpdateData
} from './helpers'
import { HelpRequestRepo } from '~/server/database'
import { CreateHelpRequestInput, EditHelpRequestInput } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { markFollowupTypeAsUsed } from '~/server/query'
import { HelpRequestWithRelations } from '~/server/query/helpRequests'

type BeneficiaryMeta = Pick<Beneficiary, 'id'> & { referents: { id: string }[] }

type CreateParams = {
  ctx: Omit<ProtectedAppContext, 'event'>
  input: CreateHelpRequestInput
  beneficiary: BeneficiaryMeta
  target?: undefined
}

type UpdateParams = {
  ctx: Omit<ProtectedAppContext, 'event'>
  input: EditHelpRequestInput
  beneficiary?: undefined
  target: HelpRequestWithRelations
}

function prismaCreate({ input, ctx, beneficiary }: CreateParams) {
  const data = prepareHelpRequestCreateData(input, ctx, beneficiary)

  return HelpRequestRepo.prisma.create({
    data,
    include: {
      beneficiary: {
        select: {
          id: true,
          fileNumber: true
        }
      }
    }
  })
}

function prismaUpdate({ input, ctx, target }: UpdateParams) {
  const data = prepareHelpRequestUpdateData(input, ctx, target)

  return HelpRequestRepo.prisma.update({
    where: { id: input.id },
    data,
    include: {
      beneficiary: {
        select: {
          id: true,
          fileNumber: true
        }
      }
    }
  })
}

export async function set(params: CreateParams | UpdateParams) {
  const helpRequest = params.beneficiary
    ? await prismaCreate(params)
    : await prismaUpdate(params)

  await markFollowupTypeAsUsed([params.input.typeId])

  return { helpRequest }
}
