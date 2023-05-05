import { TRPCError } from '@trpc/server'
import { AppContext, forbiddenError } from '../trpc'
import { canListBeneficiaries } from '../query/security/rules'
import { SearchBeneficiaryInput } from '../schema/beneficiary.schema'
import { createBeneficiary } from '~/server/query/beneficiaires/createBeneficiary'
import { BeneficiaryCreationInput } from '~/server/schema'
import { prismaClient } from '~/server/prisma'

export const getBeneficiaryDetailsHandler = async ({
  input,
  ctx: { user }
}: {
  input: { id: string }
  ctx: AppContext
}) => {
  const { structureId } = user
  const conditions = {
    id: input.id
  }

  const where = structureId
    ? {
        ...conditions,
        structureId
      }
    : conditions

  const beneficiary = await prismaClient.beneficiary.findFirst({
    where,
    include: {
      referents: true,
      relatives: {
        include: {
          beneficiary: true
        }
      }
    }
  })
  if (!beneficiary) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `No beneficiary found with conditions ${JSON.stringify(where)}`
    })
  }
  const { relatives, ...beneficiaryData } = beneficiary

  const taxHouseholds = (relatives || []).filter(relative => relative.hosted)
  const entourages = (relatives || []).filter(relative => !relative.hosted)

  return { beneficiary: beneficiaryData, taxHouseholds, entourages }
}

export const createBeneficiaryHandler = async ({
  input,
  ctx: { user }
}: {
  input: BeneficiaryCreationInput
  ctx: AppContext
}) => {
  const beneficiary = await createBeneficiary(input, user)

  return beneficiary
}

const tokenToSearchCondition = (token: string) => ({
  contains: token,
  mode: 'insensitive'
})

export const searchBeneficiaryHandler = async ({
  input: { query },
  ctx: { user }
}: {
  input: SearchBeneficiaryInput
  ctx: AppContext
}) => {
  const { structureId } = user

  if (!canListBeneficiaries(user, { structureId })) {
    throw forbiddenError()
  }
  // TODO unit test
  const tokens = query.trim().replace(/%/g, '').split(/\s+/g)

  const fields = ['firstName', 'birthName', 'usualName', 'fileNumber'] as const

  const searchConditions = tokens.map(token => ({
    OR: fields.map(field => ({
      [field]: tokenToSearchCondition(token)
    }))
  }))

  const conditions = {
    archived: null,
    AND: searchConditions
  }

  const where = structureId
    ? {
        ...conditions,
        structureId
      }
    : conditions

  // TODO benchmark this and stress tes, then create indexes for case-insensitive filtering.
  // TODO check pg_trgm https://www.postgresql.org/docs/12/pgtrgm.html#id-1.11.7.40.7 for indexing
  const beneficiaries = await prismaClient.beneficiary.findMany({
    where,
    orderBy: [{ usualName: 'asc' }, { birthName: 'asc' }],
    select: {
      id: true,
      usualName: true,
      firstName: true,
      birthName: true,
      fileNumber: true,
      birthDate: true
    }
  })

  return beneficiaries
}
