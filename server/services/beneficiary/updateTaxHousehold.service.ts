import { Prisma } from '@prisma/client'
import { BeneficiaryRepo, BeneficiaryRelativeRepo } from '~/server/database'
import { SecurityRuleGrantee } from '~/server/security'
import { UpdateBeneficiaryTaxHouseholdInput } from '~/server/schema'
import { prepareRelationUpdates, prepareDateFields } from '~/utils/prisma'
import {
  filterLinkedTaxHouseholds,
  prepareOppositeRelative
} from '~/utils/relatives'

function getBeneficiaryWithTaxHousehold(user: SecurityRuleGrantee, id: string) {
  return BeneficiaryRepo.findUniqueOrThrow(user, {
    where: { id },
    select: {
      id: true,
      structureId: true,
      relatives: {
        include: { linkedBeneficiary: true },
        where: { hosted: true }
      }
    }
  })
}

type BeneficiaryTaxHouseholds = Array<
  Omit<
    Prisma.PromiseReturnType<
      typeof getBeneficiaryWithTaxHousehold
    >['relatives'][0],
    'linkedBeneficiary'
  > & { linkedBeneficiaryId: string | null }
>

function filterEmptyTaxHousehold(
  taxHousehold: Exclude<
    UpdateBeneficiaryTaxHouseholdInput['taxHouseholds'],
    undefined | null
  >[0]
) {
  return Object.entries(taxHousehold).some(
    ([key, value]) => key !== 'id' && !!value
  )
}

type UpdateBeneficiaryTaxHouseholdInputTaxHouseholds = Exclude<
  UpdateBeneficiaryTaxHouseholdInput['taxHouseholds'],
  undefined | null
>

function prepareTaxHouseholdsUpdates(
  taxHouseholds: UpdateBeneficiaryTaxHouseholdInputTaxHouseholds,
  previousTaxHouseholds: BeneficiaryTaxHouseholds
) {
  const newTaxHouseholds = taxHouseholds
    .filter(filterEmptyTaxHousehold)
    .map(e => {
      const { linkedBeneficiary, ...data } = e
      return {
        hosted: true,
        ...prepareDateFields(data, ['birthDate']),
        linkedBeneficiaryId: linkedBeneficiary ? linkedBeneficiary.id : null
      }
    })

  return prepareRelationUpdates(newTaxHouseholds, previousTaxHouseholds)
}

type TaxHouseholdsUpdates = ReturnType<typeof prepareTaxHouseholdsUpdates>

function prepareOppositeTaxHouseholdsFromCreated(
  createdTaxHouseholds: TaxHouseholdsUpdates['create'],
  beneficiaryId: string
) {
  const createdLinkedTaxHouseholds = createdTaxHouseholds.filter(
    filterLinkedTaxHouseholds
  )

  return createdLinkedTaxHouseholds.map(l =>
    prepareOppositeRelative(l, beneficiaryId)
  )
}

function prepareOppositeTaxHouseholdsFromUpdated(
  updatedTaxHouseholds: TaxHouseholdsUpdates['update'],
  previousTaxHouseholds: BeneficiaryTaxHouseholds,
  beneficiaryId: string
) {
  const updatedLinkedTaxHouseholds = updatedTaxHouseholds
    .map(({ where: { id }, data }) => ({ ...data, id }))
    .filter(filterLinkedTaxHouseholds)

  const newLinkedTaxHouseholds = updatedLinkedTaxHouseholds.filter(
    ({ id, linkedBeneficiaryId }) => {
      const previous = previousTaxHouseholds.find(
        previous => previous.id === id
      )

      if (!previous) {
        return false
      }

      return previous.linkedBeneficiaryId !== linkedBeneficiaryId
    }
  )

  return newLinkedTaxHouseholds.map(l =>
    prepareOppositeRelative(l, beneficiaryId)
  )
}

async function createOppositeTaxHouseholds(
  {
    create: createdTaxHouseholds,
    update: updatedTaxHouseholds
  }: TaxHouseholdsUpdates,
  previousTaxHouseholds: BeneficiaryTaxHouseholds,
  beneficiaryId: string
) {
  const linkedTaxHouseholdDatas = [
    ...prepareOppositeTaxHouseholdsFromCreated(
      createdTaxHouseholds,
      beneficiaryId
    ),
    ...prepareOppositeTaxHouseholdsFromUpdated(
      updatedTaxHouseholds,
      previousTaxHouseholds,
      beneficiaryId
    )
  ]

  if (linkedTaxHouseholdDatas.length) {
    await BeneficiaryRelativeRepo.prisma.createMany({
      data: linkedTaxHouseholdDatas
    })
  }
}

function getRemovedLinkedBeneficiaries(
  updatedTaxHouseholds: TaxHouseholdsUpdates['update'],
  previousTaxHouseholds: BeneficiaryTaxHouseholds,
  user: SecurityRuleGrantee
) {
  // FIXME : It gets way to complicated
  const previousLinkedTaxHouseholds = previousTaxHouseholds.filter(
    filterLinkedTaxHouseholds
  )

  const updatedTaxHouseholdsWithoutLink = updatedTaxHouseholds
    .map(({ where: { id }, data }) => ({ ...data, id }))
    .filter(t => !!(t.hosted && t.linkedBeneficiaryId))

  const unlinkedTaxHouseholds = previousLinkedTaxHouseholds.filter(
    ({ id, linkedBeneficiaryId }) => {
      const previous = previousTaxHouseholds.find(
        previous => previous.id === id
      )

      if (!previous) {
        return false
      }

      return previous.linkedBeneficiaryId
    }
  )

  return unlinkedTaxHouseholds.map({ link })

  // return BeneficiaryRelativeRepo.findMany(user, {
  //   where: {linkedBeneficiaryId: {in: }},
  //   select: {id: true}
  // })
}

async function getOppositeTaxHouseholdsFromUpdated() {}

async function removeOppositeLinkedBeneficiaries(
  { update: updatedTaxHouseholds }: TaxHouseholdsUpdates,
  previousTaxHouseholds: BeneficiaryTaxHouseholds,
  beneficiaryId: string
) {
  const oppositeTaxHouseholds = await getOppositeTaxHouseholdsFromUpdated()
}

export async function updateTaxHousehold(
  user: SecurityRuleGrantee,
  input: UpdateBeneficiaryTaxHouseholdInput
) {
  // TODO: Remove opposite taxhouseholds
  const { id: beneficiaryId, taxHouseholds, ...taxHouseholdDatas } = input

  const { relatives: previousTaxHouseholds } =
    await getBeneficiaryWithTaxHousehold(user, beneficiaryId)

  const flattenPreviousTaxHouseholds = previousTaxHouseholds.map(p => {
    const { linkedBeneficiary, ...data } = p
    return {
      ...data,
      linkedBeneficiaryId: linkedBeneficiary ? linkedBeneficiary.id : null
    }
  })

  const data = {
    ...taxHouseholdDatas,
    taxHouseholds: prepareTaxHouseholdsUpdates(
      taxHouseholds || [],
      flattenPreviousTaxHouseholds
    )
  }

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id: beneficiaryId },
    data
  })

  await createOppositeTaxHouseholds(
    data.taxHouseholds,
    flattenPreviousTaxHouseholds,
    beneficiaryId
  )

  return updatedBeneficiary
}
