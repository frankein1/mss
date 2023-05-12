import { TRPCError } from '@trpc/server'
import { AppContext, forbiddenError } from '../trpc'
import {
  canEditBeneficiaryExternalOrganisations,
  canEditBeneficiaryGeneralInformation,
  canEditBeneficiaryHealthInfo,
  canEditBeneficiaryOccupationIncome,
  canListBeneficiaries,
  canUpdateBeneficiaryReferents,
  canUpdateBeneficiaryRelatives
} from '../query/security/rules'
import {
  SearchBeneficiaryInput,
  UpdateBeneficiaryInput,
  BeneficiaryCreationInput
} from '../schema/beneficiary.schema'
import { createBeneficiary } from '~/server/query/beneficiaires/createBeneficiary'
import { prismaClient } from '~/server/prisma'

export const getBeneficiaryDetailsHandler = async ({
  input,
  ctx: { user }
}: {
  input: { id: string }
  ctx: AppContext
}) => {
  const beneficiary = await findWithReferentsAndRelatives({
    id: input.id,
    structureId: user.structureId
  })
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

export const updateBeneficiaryHandler = async ({
  input,
  ctx: { user }
}: {
  input: UpdateBeneficiaryInput
  ctx: AppContext
}) => {
  const { referents: previousReferents, relatives: oldRelatives } =
    await findWithReferentsAndRelatives({
      id: input.id,
      structureId: user.structureId
    })

  const previousIds = previousReferents.map(({ id }) => id)

  const {
    id,
    structureId,
    referents: updateIds,
    aidantConnectAuthorized,
    general,
    health,
    external,
    occupation,
    taxHousehold,
    entourage
  } = input

  let data = {}

  if (
    canUpdateBeneficiaryReferents(user, {
      structureId,
      referents: previousReferents
    })
  ) {
    const newIds =
      updateIds.filter(updateId => !previousIds.includes(updateId)) || []
    const trashIds = previousIds.filter(id => !updateIds.includes(id)) || []

    const createIds = newIds.map(id => ({
      id
    }))
    const deleteIds = trashIds.map(id => ({
      id
    }))

    data = {
      ...data,
      referents: {
        connect: createIds,
        disconnect: deleteIds
      }
    }
  }
  if (canEditBeneficiaryGeneralInformation(user, input)) {
    data = { ...data, ...general, aidantConnectAuthorized }
  }
  if (canEditBeneficiaryHealthInfo(user, input)) {
    data = { ...data, ...health }
  }

  if (canEditBeneficiaryExternalOrganisations(user, input)) {
    data = { ...data, ...external }
  }
  if (canEditBeneficiaryOccupationIncome(user, input)) {
    data = { ...data, ...occupation }
  }
  if (canUpdateBeneficiaryRelatives(user, input)) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { taxHouseholds, ...taxHouseholdDatas } = taxHousehold
    data = { ...data, ...taxHouseholdDatas }
  }

  if (canUpdateBeneficiaryRelatives(user, input)) {
    const { entourages: newEntourages } = entourage
    const previousEntourages = oldRelatives.filter(r => !r.hosted)

    const createEntourages =
      newEntourages.filter(
        ({ id }) => !previousEntourages.map(({ id }) => id).includes(id)
      ) || []
    const trashEntourages =
      previousEntourages.filter(
        ({ id }) => !newEntourages.map(({ id }) => id).includes(id)
      ) || []
    const updateEntourages =
      newEntourages.filter(({ id }) =>
        previousEntourages.map(({ id }) => id).includes(id)
      ) || []

    data = {
      ...data,
      relatives: {
        create: createEntourages,
        delete: trashEntourages.map(({ id }) => ({ id })),
        update: updateEntourages.map(({ id, ...data }) => ({
          where: { id },
          data
        }))
      }
    }
  }

  const beneficiary = await prismaClient.beneficiary.update({
    where: { id },
    data
  })
  return beneficiary
}

async function findWithReferentsAndRelatives({
  structureId,
  id
}: {
  structureId: string | null
  id: string
}) {
  const conditions = {
    id
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
  return beneficiary
}
