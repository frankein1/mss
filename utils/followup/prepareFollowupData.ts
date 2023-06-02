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
  User
} from '@prisma/client'
import { canEditBeneficiaryFollowupPrivateSynthesis } from '~/server/query/security/rules'
import { AddFollowupInput, EditFollowupInput } from '~/server/schema'
import { preparePrescribingOrganization } from '~/utils/prescribingOrganization/preparePrescribingOrganization'
import { prepareDocumentsMutations } from '~/utils/document/prepareDocumentMutations'

type FollowupTarget = Followup & {
  beneficiary: Beneficiary & {
    referents: User[]
  }
  documents: Document[]
  types: FollowupType[]
}

function prepareMinistryData(
  type: StructureType,
  {
    ActionLogement,
    Bailleur,
    DeetsSiao,
    Prefecture,
    SecoursMedecinTraitant,
    ChefCabinet,
    OrganismeMenace,
    Prefet,
    numeroPegase,
    ministre,
    classified,
    forwardedToJustice
  }: AddFollowupInput | EditFollowupInput
) {
  const interventionBooleans: { [k in FollowupIntervention]: boolean } = {
    ActionLogement,
    Bailleur,
    DeetsSiao,
    Prefecture,
    SecoursMedecinTraitant
  }

  const signalementBooleans: { [k in FollowupSignalement]: boolean } = {
    ChefCabinet,
    OrganismeMenace,
    Prefet
  }

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
      numeroPegase,
      ministre,
      classified,
      forwardedToJustice,
      interventions,
      signalements
    }
  }

  return {}
}

function prepareFollowupTypesMutations(
  inputTypes: string[],
  targetTypes: FollowupType[] | undefined
) {
  return {
    connect: inputTypes.map(id => ({ id })),
    disconnect: targetTypes
      ?.filter(({ id }) => !inputTypes.includes(id))
      .map(({ id }) => ({ id }))
  }
}

export async function prepareFollowupData({
  input,
  transaction,
  user
}: {
  input: AddFollowupInput
  transaction: Prisma.TransactionClient
  user: User
}): Promise<Prisma.FollowupUncheckedCreateInput>
export async function prepareFollowupData({
  input,
  transaction,
  user,
  target
}: {
  input: EditFollowupInput
  transaction: Prisma.TransactionClient
  user: User
  target: FollowupTarget
}): Promise<Prisma.FollowupUncheckedUpdateInput>
export async function prepareFollowupData({
  input,
  transaction,
  user,
  target
}: {
  input: AddFollowupInput | EditFollowupInput
  transaction: Prisma.TransactionClient
  user: User
  target?: FollowupTarget
}): Promise<
  Prisma.FollowupUncheckedCreateInput | Prisma.FollowupUncheckedUpdateInput
> {
  const { structureId } = await transaction.beneficiary.findUniqueOrThrow({
    where: { id: input.beneficiaryId },
    select: { structureId: true }
  })

  const { type } = await transaction.structure.findUniqueOrThrow({
    where: { id: structureId },
    select: {
      type: true
    }
  })

  const ministryData = prepareMinistryData(type, input)

  const prescribingOrganizationId = await preparePrescribingOrganization(
    transaction,
    user,
    structureId,
    input.prescribingOrganizationId
  )

  return {
    ...input,
    structureId,
    types: prepareFollowupTypesMutations(input.types, target?.types),
    documents: prepareDocumentsMutations(input.documents, target?.documents),
    createdById: user.id,
    place:
      input.medium === FollowupMedium.ExternalAppointment ? input.place : null,
    thirdPersonName:
      input.medium === FollowupMedium.ThirdParty ? input.thirdPersonName : null,
    privateSynthesis: canEditBeneficiaryFollowupPrivateSynthesis(
      user,
      target || null
    )
      ? input.privateSynthesis
      : null,
    structureName: input.redirected ? input.structureName : null,
    prescribingOrganizationId,
    ...ministryData
  }
}
