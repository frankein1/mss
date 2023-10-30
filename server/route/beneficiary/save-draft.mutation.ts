import { UserActivityType, Prisma } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import {
  SaveDraftInput,
  SaveBeneficiaryGeneralInformationInput,
  SaveBeneficiaryTaxHouseholdInput,
  SaveBeneficiaryEntourageInput,
  SaveBeneficiaryHealthInput,
  SaveBeneficiaryOccupationInput,
  SaveBeneficiaryExternalOrganisationsInput,
  saveDraftSchema
} from '~/server/schema'
import { generateFileNumber } from '~/utils/generateFileNumber'
import { BeneficiaryDraft } from '~/types/beneficiary'
import { DraftRepo } from '~/server/database'
import { AllowSecurityCheck } from '~/server/security/types'
import { getBeneficiaryPermissionRules } from '~/server/security/getPermissionRules'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx
}: {
  input: SaveDraftInput
  ctx: ProtectedAppContext
}) => {
  const { id: draftId } = input
  const beneficiaryDraft = await DraftRepo.findUniqueOrThrow(ctx.user, {
    where: { id: draftId }
  })

  const data = prepareData(ctx, input, beneficiaryDraft)

  return await prismaClient.$transaction(async tx => {
    const { id } = await tx.beneficiary.create({
      data
    })

    await addUserActivity({
      userId: ctx.user.id,
      activity: UserActivityType.CREATE,
      object: 'Beneficiary',
      objectId: id,
      transaction: tx
    })

    if (beneficiaryDraft) {
      await tx.draft.delete({
        where: {
          id: draftId
        }
      })
    }

    return { id }
  })
}

function prepareData(
  { user, structure }: ProtectedAppContext,
  input: SaveDraftInput,
  beneficiaryDraft: BeneficiaryDraft
) {
  const {
    general,
    taxHousehold,
    entourage,
    health,
    occupation,
    externalOrganisations
  } = getDataFromSources(input, beneficiaryDraft)

  if (!general) {
    throw new Error(
      'Beneficiary should at least have general information defined.'
    )
  }

  const fileNumber = generateFileNumber()

  let data = {
    structureId: user.structureId,
    fileNumber,
    ...general,
    phone1: general.noPhone ? null : general.phone1,
    phone2: general.noPhone ? null : general.phone2,
    referents: {
      connect: general.referents.map(referent => ({ id: referent }))
    },
    createdById: user.id
  } as Prisma.BeneficiaryUncheckedCreateInput

  const securityTarget = {
    structureId: user.structureId,
    referents: general.referents
  }

  const permissionRules = getBeneficiaryPermissionRules(user.role)

  const isDetailUpdatable = permissionRules.update.detail(user, securityTarget)

  if (taxHousehold || (entourage && isDetailUpdatable)) {
    if (taxHousehold) {
      const { taxHouseholds: _, ...taxHouseholdDatas } = taxHousehold

      data = {
        ...data,
        ...taxHouseholdDatas
      }
    }

    const taxHouseholds =
      taxHousehold?.taxHouseholds?.map(e => {
        return {
          ...e,
          hosted: true,
          linkedBeneficiaryId: e.linkedBeneficiary
            ? e.linkedBeneficiary.id
            : null
        }
      }) || []
    const entourages =
      entourage?.entourages?.map(e => ({ ...e, hosted: false })) || []
    const newRelatives = [...taxHouseholds, ...entourages]

    data = {
      ...data,
      relatives: {
        create: newRelatives
      }
    }
  }

  if (health && isDetailUpdatable) {
    const { socialSecurityNumber, ...otherHealthData } = health

    data = { ...data, ...otherHealthData }

    if (beneficiaryPermissionRules.update.nir(structure.type)) {
      data = { ...data, socialSecurityNumber }
    }
  }

  if (isDetailUpdatable) {
    data = { ...data, ...occupation }
  }

  if (isDetailUpdatable) {
    data = { ...data, ...externalOrganisations }
  }

  return data
}

function getDataFromSources(
  input: SaveDraftInput,
  beneficiaryDraft: BeneficiaryDraft
) {
  const general = (input.general || beneficiaryDraft.content?.general) as
    | SaveBeneficiaryGeneralInformationInput
    | undefined
  const taxHousehold = (input.taxHousehold ||
    beneficiaryDraft.content?.taxHousehold) as
    | SaveBeneficiaryTaxHouseholdInput
    | undefined
  const entourage = (input.entourage || beneficiaryDraft.content?.entourage) as
    | SaveBeneficiaryEntourageInput
    | undefined
  const health = (input.health || beneficiaryDraft.content?.health) as
    | SaveBeneficiaryHealthInput
    | undefined
  const occupation = (input.occupation ||
    beneficiaryDraft.content?.occupation) as
    | SaveBeneficiaryOccupationInput
    | undefined
  const externalOrganisations = (input.externalOrganisations ||
    beneficiaryDraft.content?.externalOrganisations) as
    | SaveBeneficiaryExternalOrganisationsInput
    | undefined

  return {
    general,
    taxHousehold,
    entourage,
    health,
    occupation,
    externalOrganisations
  }
}

export const saveDraftMutation = createMutation({
  inputValidation: saveDraftSchema,
  securityCheck,
  handler
})
