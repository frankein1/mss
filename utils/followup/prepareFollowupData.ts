import {
  Prisma,
  StructureType,
  Beneficiary,
  Document,
  Followup,
  FollowupIntervention,
  FollowupSignalement,
  FollowupType,
  FollowupMedium,
  User,
  Minister
} from '@prisma/client'
import { newOptionToLabel, NEW_OPTION_PREFIX } from '~/utils/options'
import {
  canEditBeneficiaryFollowupPrivateSynthesis,
  canCreatePrescribingOrganization
} from '~/server/query/security/rules'
import { AddFollowupInput, EditFollowupInput } from '~/server/schema'

function prepareMinistryData(
  type: StructureType,
  interventionBooleans: { [k in FollowupIntervention]: boolean },
  signalementBooleans: { [k in FollowupSignalement]: boolean },
  ministryData: {
    numeroPegase: string | null | undefined
    ministre: Minister | null | undefined
    classified: boolean
    forwardedToJustice: boolean
  }
) {
  if (type === StructureType.Ministere) {
    const interventions = Object.entries(interventionBooleans).reduce(
      (interventions, [intervention, enabled]) => {
        if (enabled) {
          return [...interventions, intervention as FollowupIntervention]
        }
        return interventions
      },
      [] as FollowupIntervention[]
    )

    const signalements = Object.entries(signalementBooleans).reduce(
      (signalements, [signalement, enabled]) => {
        if (enabled) {
          return [...signalements, signalement as FollowupSignalement]
        }
        return signalements
      },
      [] as FollowupSignalement[]
    )

    return {
      ...ministryData,
      interventions,
      signalements
    }
  }

  return {}
}

async function prepareCreatedPrescribingOrganization(
  transaction: Prisma.TransactionClient,
  user: User,
  structureId: string,
  prescribingOrganizationId: string | null | undefined
) {
  if (
    canCreatePrescribingOrganization(user) &&
    prescribingOrganizationId?.startsWith(NEW_OPTION_PREFIX)
  ) {
    const { id } = await transaction.prescribingOrganization.create({
      data: {
        name: newOptionToLabel(prescribingOrganizationId),
        structureId,
        createdById: user.id
      }
    })
    return id
  }

  return undefined
}

export async function prepareFollowupData({
  input,
  transaction,
  user,
  target
}: {
  input: AddFollowupInput | EditFollowupInput
  transaction: Prisma.TransactionClient
  user: User
  target?: Followup & {
    beneficiary: Beneficiary & {
      referents: User[]
    }
    documents: Document[]
    types: FollowupType[]
  }
}) {
  const {
    beneficiaryId,
    types,
    documents,
    date,
    dueDate,
    numeroPegase,
    ministre,
    medium,
    place,
    thirdPersonName,
    privateSynthesis,
    redirected,
    structureName,
    classified,
    forwardedToJustice,
    prescribingOrganizationId,
    ActionLogement,
    Bailleur,
    DeetsSiao,
    Prefecture,
    SecoursMedecinTraitant,
    ChefCabinet,
    OrganismeMenace,
    Prefet,
    ...data
  } = input

  const { structureId } = await transaction.beneficiary.findUniqueOrThrow({
    where: { id: beneficiaryId },
    select: { structureId: true }
  })

  const { type } = await transaction.structure.findUniqueOrThrow({
    where: { id: structureId },
    select: {
      type: true
    }
  })

  const ministryData = prepareMinistryData(
    type,
    { ActionLogement, Bailleur, DeetsSiao, Prefecture, SecoursMedecinTraitant },
    { ChefCabinet, OrganismeMenace, Prefet },
    { numeroPegase, ministre, classified, forwardedToJustice }
  )

  const createdPrescribingOrganizationId =
    await prepareCreatedPrescribingOrganization(
      transaction,
      user,
      structureId,
      prescribingOrganizationId
    )

  return {
    structureId,
    beneficiaryId,
    // TODO Helper for date string => Date
    date: new Date(date),
    dueDate: dueDate ? new Date(dueDate) : null,
    types: {
      connect: types.map(id => ({ id })),
      disconnect: target?.types
        .filter(type => !types.includes(type.id))
        .map(type => ({ id: type.id }))
    },
    documents: {
      connect: documents.map(key => ({ key })),
      disconnect: target?.documents
        .filter(document => !documents.includes(document.key))
        .map(document => ({ key: document.key }))
    },
    createdById: user.id,
    medium,
    place:
      medium === FollowupMedium.ExternalAppointment && place ? place : null,
    thirdPersonName:
      medium === FollowupMedium.ThirdParty && thirdPersonName
        ? thirdPersonName
        : null,
    privateSynthesis:
      canEditBeneficiaryFollowupPrivateSynthesis(user, null) && privateSynthesis
        ? privateSynthesis
        : null,
    redirected,
    structureName: redirected && structureName ? structureName : null,
    prescribingOrganizationId:
      createdPrescribingOrganizationId || prescribingOrganizationId,
    ...ministryData,
    ...data
  }
}
