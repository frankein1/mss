import {
  Prisma,
  Beneficiary,
  Document,
  HelpRequest,
  User,
  StructureType
} from '@prisma/client'
import { CreateHelpRequestInput, EditHelpRequestInput } from '~/server/schema'
import { preparePrescribingOrganization } from '~/utils/prescribingOrganization/preparePrescribingOrganization'
import { prepareInstructorOrganization } from '~/utils/instructorOrganization/prepareInstructorOrganization'
import { prepareDocumentsMutations } from '~/utils/document/prepareDocumentMutations'
import { canEditBeneficiaryHelpRequestPrivateSynthesis } from '~/server/query/security/rules'

type HelpRequestTarget = HelpRequest & {
  beneficiary: Beneficiary & {
    referents: User[]
  }
  documents: Document[]
}

function prepareMinistryData(
  type: StructureType,
  { numeroPegase, ministre }: CreateHelpRequestInput | EditHelpRequestInput
) {
  if (type === StructureType.Ministere) {
    return { numeroPegase, ministre }
  }
  return {}
}

export async function prepareHelpRequestData({
  input,
  transaction,
  user
}: {
  input: CreateHelpRequestInput
  transaction: Prisma.TransactionClient
  user: User
}): Promise<Prisma.HelpRequestUncheckedCreateInput>
export async function prepareHelpRequestData({
  input,
  transaction,
  user,
  target
}: {
  input: EditHelpRequestInput
  transaction: Prisma.TransactionClient
  user: User
  target: HelpRequestTarget
}): Promise<Prisma.HelpRequestUncheckedUpdateInput>
export async function prepareHelpRequestData({
  input,
  transaction,
  user,
  target
}: {
  input: CreateHelpRequestInput | EditHelpRequestInput
  transaction: Prisma.TransactionClient
  user: User
  target?: HelpRequestTarget
}): Promise<
  | Prisma.HelpRequestUncheckedCreateInput
  | Prisma.HelpRequestUncheckedUpdateInput
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

  const instructorOrganizationId = await prepareInstructorOrganization(
    transaction,
    user,
    structureId,
    input.instructorOrganizationId
  )

  return {
    ...input,
    structureId,
    documents: prepareDocumentsMutations(input.documents, target?.documents),
    financialSupport: input.financialSupport === 'true',
    externalStructure: input.externalStructure === 'true',
    prescribingOrganizationId,
    instructorOrganizationId,
    privateSynthesis: canEditBeneficiaryHelpRequestPrivateSynthesis(
      user,
      target || null
    )
      ? input.privateSynthesis
      : null,
    createdById: user.id,
    ...ministryData
  }
}
