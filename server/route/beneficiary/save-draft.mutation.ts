import { UserActivityType, Prisma } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
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
import { getBeneficiaryPermissions } from '~/server/security'
import { generateFileNumber } from '~/utils/generateFileNumber'
import { BeneficiaryDraft } from '~/types/beneficiary'
import { BeneficiaryRepo, DraftRepo } from '~/server/database'
import { AllowSecurityCheck } from '~/server/security/rules/types'

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
  const { id } = await BeneficiaryRepo.prisma.create({
    data
  })

  if (beneficiaryDraft) {
    await DraftRepo.prisma.delete({
      where: {
        id: draftId
      }
    })
  }

  return { id }
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

  const permissions = getBeneficiaryPermissions({ user, structure })

  if ((taxHousehold || entourage) && permissions.edit.relatives) {
    if (taxHousehold) {
      const { taxHouseholds: _, ...taxHouseholdDatas } = taxHousehold

      data = {
        ...data,
        ...taxHouseholdDatas
      }
    }

    const taxHouseholds =
      taxHousehold?.taxHouseholds?.map(({ linkedBeneficiary, ...e }) => {
        return {
          ...e,
          hosted: true,
          linkedBeneficiaryId: linkedBeneficiary ? linkedBeneficiary.id : null
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

  if (health && permissions.edit.health) {
    data = { ...data, ...health }
  }

  if (permissions.edit.occupationIncome) {
    data = { ...data, ...occupation }
  }

  if (permissions.edit.externalOrganisations) {
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
  securityCheck: AllowSecurityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.saveDraft',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.CREATE
  }
})
